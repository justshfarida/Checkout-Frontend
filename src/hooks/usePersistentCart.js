import { useEffect, useReducer } from "react";
import { cartReducer } from "../reducers/cartReducer";

const STORAGE_KEY = "game-items-store-cart";

function getInitialCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function usePersistentCart() {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialCart);
  //
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return [cart, dispatch];
}
