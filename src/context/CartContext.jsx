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
   * Guest cart persistence
   *
   * Only save to localStorage while logged out.
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

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

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
   * Convert backend cart item
   * into the shape our frontend expects.
   */
  function formatServerItem(item, index) {
    return {
      ...item,

      // Backend stores cents
      price: item.price / 100,

      initial:
        item.name?.charAt(0).toUpperCase() ||
        "?",

      variant:
        variants[index % variants.length],

      soldOut: item.stock <= 0,
    };
  }

  /*
   * GET authenticated user's cart
   */
  async function loadServerCart() {
    const response = await api.get(
      "/user/cart"
    );

    const serverItems =
      response.data.items ?? [];

    const formattedCart = serverItems.map(
      formatServerItem
    );

    dispatch({
      type: "SET_CART",
      cart: formattedCart,
    });

    return formattedCart;
  }

  /*
   * Called after login.
   *
   * Takes the guest cart from localStorage
   * and sends every item to the backend.
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
     * After syncing, ask backend for the
     * authoritative cart.
     */
    await loadServerCart();

    /*
     * Guest cart has successfully been
     * transferred to the backend.
     */
    setStoredCart([]);
  }

  async function addToCart(item) {
    /*
     * Guest:
     * reducer changes React state.
     * useEffect above persists it to localStorage.
     */
    if (!isAuthenticated) {
      dispatch({
        type: "ADD",
        item,
      });

      return;
    }

    /*
     * Logged in:
     * determine final quantity first.
     */
    const existing = cart.find(
      (cartItem) => cartItem.id === item.id
    );

    const newQuantity = existing
      ? existing.quantity + 1
      : 1;
    try{
        await api.patch(
      `/user/cart/items/${item.id}`,
      {
        quantity: newQuantity,
      }
    );

    }
    catch(error){
       if (error.response?.status === 401) {
      dispatch({
        type: "ADD",
        item,
      });

      return;
    }
    throw error;

  }
    
    /*
     * Backend succeeded, now update UI.
     */
    dispatch({
      type: "ADD",
      item,
    });
  }

  async function increment(id) {
    const item = cart.find(
      (item) => item.id === id
    );

    if (!item) return;

    if (!isAuthenticated) {
      dispatch({
        type: "INCREMENT",
        id,
      });

      return;
    }

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

  async function decrement(id) {
    const item = cart.find(
      (item) => item.id === id
    );

    if (!item) return;

    /*
     * If quantity is already 1,
     * decrementing should remove the item.
     */
    if (item.quantity === 1) {
      await remove(id);
      return;
    }

    if (!isAuthenticated) {
      dispatch({
        type: "DECREMENT",
        id,
      });

      return;
    }

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

  async function remove(id) {
    if (!isAuthenticated) {
      dispatch({
        type: "REMOVE",
        id,
      });

      return;
    }

    await api.delete(
      `/user/cart/items/${id}`
    );

    dispatch({
      type: "REMOVE",
      id,
    });
  }

  function clearCart() {
    dispatch({
      type: "CLEAR",
    });

    if (!isAuthenticated) {
      setStoredCart([]);
    }
  }

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

  return (
    <CartContext.Provider value={value}>
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