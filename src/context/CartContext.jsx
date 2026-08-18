import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cartReducer } from "../reducers/cartReducer";

const CART_STORAGE_KEY = "game-items-store-cart";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [storedCart, setStoredCart] = useLocalStorage(CART_STORAGE_KEY, []);
  const [cart, dispatch] = useReducer(cartReducer, storedCart);

  useEffect(() => {
    setStoredCart(cart);
  }, [cart, setStoredCart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    document.title =
      cartCount > 0 ? `(${cartCount}) Game Items Store` : "Game Items Store";

    return () => {
      document.title = "Game Items Store";
    };
  }, [cartCount]);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      total,
      addToCart: (item) => dispatch({ type: "ADD", item }),
      increment: (id) => dispatch({ type: "INCREMENT", id }),
      decrement: (id) => dispatch({ type: "DECREMENT", id }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    }),
    [cart, cartCount, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
