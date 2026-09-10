import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { cartReducer } from "../reducers/cartReducer";
import { useAuth } from "./AuthContext";

import api from "../api/client";

const CART_STORAGE_KEY = "game-items-store-cart";

const CartContext = createContext(null);

const variants = [
  "cyan",
  "lime",
  "purple",
  "blue",
  "orange",
  "pink",
];

export function CartProvider({ children }) {
  const [storedCart, setStoredCart] =
    useLocalStorage(CART_STORAGE_KEY, []);

  const [cart, dispatch] = useReducer(
    cartReducer,
    storedCart
  );

  const { isAuthenticated } = useAuth();

  /*
   * Guest cart persistence.
   *
   * Only save the cart to localStorage
   * while the user is logged out.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setStoredCart(cart);
    }
  }, [
    cart,
    isAuthenticated,
    setStoredCart,
  ]);

  /*
   * Total number of items in the cart.
   */
  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /*
   * Total cart price.
   */
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  /*
   * Update browser tab title when
   * cart quantity changes.
   */
  useEffect(() => {
    document.title =
      cartCount > 0
        ? `(${cartCount}) Game Items Store`
        : "Game Items Store";

    return () => {
      document.title = "Game Items Store";
    };
  }, [cartCount]);

  /*
   * Convert a backend cart item into
   * the shape expected by the frontend.
   */
  function formatServerItem(item, index) {
    return {
      ...item,
      initial:
        item.name
          ?.charAt(0)
          .toUpperCase() || "?",

      variant:
        variants[index % variants.length],

      soldOut:
        item.stock <= 0,
    };
  }

  /*
   * Load the authenticated user's
   * cart from the backend.
   */
  async function loadServerCart() {
    const response = await api.get(
      "/user/cart"
    );

    const serverItems =
      response.data.items ?? [];

    const formattedCart =
      serverItems.map(formatServerItem);

    dispatch({
      type: "SET_CART", 
      cart: formattedCart,
    });

    return formattedCart;
  }

  /*
   * IMPORTANT:
   *
   * When the page is refreshed,
   * AuthContext restores the access token
   * from localStorage.
   *
   * When the user becomes authenticated,
   * load their real cart from the backend.
   *
   * Without this, the cart can appear empty
   * after F5 because the guest localStorage
   * cart was cleared after login.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadServerCart().catch((error) => {
      console.error(
        "Failed to load authenticated cart:",
        error
      );
    });
  }, [isAuthenticated]);

  /*
   * Called after login.
   *
   * Transfer the guest cart from
   * localStorage to the authenticated
   * user's backend cart.
   */
  async function syncGuestCartToServer() {
    const guestCart = storedCart;

    for (const item of guestCart) {
      await api.patch(
        `/user/cart/items/${item.id}`,
        {
          quantity: item.quantity,
        }
      );
    }

    /*
     * Backend is now the authoritative
     * source for the logged-in cart.
     */
    await loadServerCart();

    /*
     * The guest cart has successfully
     * been transferred to the backend,
     * so it can be removed from localStorage.
     */
    setStoredCart([]);
  }

  /*
   * Add an item to the cart.
   */
  async function addToCart(item) {
    /*
     * Guest user:
     *
     * Update React state.
     * The persistence effect above will
     * save the cart to localStorage.
     */
    if (!isAuthenticated) {
      dispatch({
        type: "ADD",
        item,
      });

      return;
    }

    /*
     * Authenticated user:
     *
     * Calculate the final quantity that
     * should be stored in the backend.
     */
    const existing = cart.find(
      (cartItem) =>
        cartItem.id === item.id
    );

    const newQuantity = existing
      ? existing.quantity + 1
      : 1;

    try {
      await api.patch(
        `/user/cart/items/${item.id}`,
        {
          quantity: newQuantity,
        }
      );
    } catch (error) {
      /*
       * If authentication fails,
       * keep the item in the frontend cart
       * instead of making it disappear.
       */
      if (
        error.response?.status === 401
      ) {
        dispatch({
          type: "ADD",
          item,
        });

        return;
      }

      throw error;
    }

    /*
     * Backend succeeded.
     * Now update the UI.
     */
    dispatch({
      type: "ADD",
      item,
    });
  }

  /*
   * Increase quantity.
   */
  async function increment(id) {
    const item = cart.find(
      (item) => item.id === id
    );

    if (!item) {
      return;
    }

    /*
     * Guest cart.
     */
    if (!isAuthenticated) {
      dispatch({
        type: "INCREMENT",
        id,
      });

      return;
    }

    /*
     * Authenticated cart.
     */
    const newQuantity =
      item.quantity + 1;

    await api.patch(
      `/user/cart/items/${id}`,
      {
        quantity: newQuantity,
      }
    );

    dispatch({
      type: "INCREMENT",
      id,
    });
  }

  /*
   * Decrease quantity.
   */
  async function decrement(id) {
    const item = cart.find(
      (item) => item.id === id
    );

    if (!item) {
      return;
    }

    /*
     * If quantity is 1, decrement means
     * remove the item completely.
     */
    if (item.quantity === 1) {
      await remove(id);
      return;
    }

    /*
     * Guest cart.
     */
    if (!isAuthenticated) {
      dispatch({
        type: "DECREMENT",
        id,
      });

      return;
    }

    /*
     * Authenticated cart.
     */
    const newQuantity =
      item.quantity - 1;

    await api.patch(
      `/user/cart/items/${id}`,
      {
        quantity: newQuantity,
      }
    );

    dispatch({
      type: "DECREMENT",
      id,
    });
  }

  /*
   * Remove an item completely.
   */
  async function remove(id) {
    /*
     * Guest cart.
     */
    if (!isAuthenticated) {
      dispatch({
        type: "REMOVE",
        id,
      });

      return;
    }

    /*
     * Authenticated cart.
     */
    await api.delete(
      `/user/cart/items/${id}`
    );

    dispatch({
      type: "REMOVE",
      id,
    });
  }

  /*
   * Clear cart from frontend state.
   *
   * For guests we also clear localStorage.
   *
   * NOTE:
   * For authenticated users this currently
   * does NOT delete the server-side cart.
   */
  function clearCart() {
    dispatch({
      type: "CLEAR",
    });

    if (!isAuthenticated) {
      setStoredCart([]);
    }
  }

  /*
   * Values/functions exposed through
   * CartContext.
   */
  const value = useMemo(
    () => ({
      cart,
      cartCount,
      total,

      addToCart,
      increment,
      decrement,
      remove,
      clearCart,

      loadServerCart,
      syncGuestCartToServer,
    }),
    [
      cart,
      cartCount,
      total,
      isAuthenticated,
      storedCart,
    ]
  );
// "Keep/reuse this calculated value until one of these dependencies changes."
  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}