import { createContext, useContext, useEffect } from "react";
import { usePersistentCart } from "../hooks/usePersistentCart";

const CartContext = createContext(null);

export function CartProvider({ children }) { //children : Whatever components you put inside <CartProvider>...</CartProvider>.
  const [cart, dispatch] = usePersistentCart(); //custom hook

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0); //num of all card items
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  //modify document title when card count changes
  useEffect(() => {
    document.title = cartCount > 0
      ? `(${cartCount}) Game Items Store`
      : "Game Items Store";

    return () => {
      document.title = "Game Items Store";
    }; //cleanupfunction
  }, [cartCount]);

  const value = {
    cart,
    dispatch,
    cartCount,
    total,
    addToCart: (item) => dispatch({ type: "ADD", item }),
    increment: (id) => dispatch({ type: "INCREMENT", id }),
    decrement: (id) => dispatch({ type: "DECREMENT", id }),
    remove: (id) => dispatch({ type: "REMOVE", id }),
    clearCart: () => dispatch({ type: "CLEAR" })
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
