import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";

import "./Cart.css";

export default function Cart() {
  const { cart } = useCart();

  return (
    <section className="cart">
      <h1 className="cart__title">
        Your cart · {cart.length}{" "}
        {cart.length === 1 ? "item" : "items"}
      </h1>

      {cart.length === 0 ? (
        <div className="cart__empty">
          <h2 className="cart__empty-title">
            Your cart is empty
          </h2>

          <p className="cart__empty-text">
            Nothing here yet. Add an item to continue.
          </p>
        </div>
      ) : (
        <div className="cart__items">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}
    </section>
  );
}