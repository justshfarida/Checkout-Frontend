import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../hooks/useCheckout";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { status, checkout, reset } = useCheckout();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (cart.length === 0) return;

    const order = {
      customer: { name, email },
      items: cart.map(({ id, name: itemName, price, quantity }) => ({
        id,
        name: itemName,
        price,
        quantity,
        subtotal: price * quantity
      })),
      total
    };

    checkout(order);
  }

  function startNewOrder() {
    clearCart();
    setName("");
    setEmail("");
    reset();
  }

  if (status === "success") {
    return (
      <section className="checkout-card success-card">
        <div className="success-icon">✓</div>
        <h2>Order complete</h2>
        <p>Your game items are ready. The order object was logged to the console.</p>
        <button onClick={startNewOrder}>Start a new order</button>
      </section>
    );
  }

  return (
    <section className="checkout-card">
      <p className="eyebrow">Final step</p>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Player name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="player@example.com"
            required
          />
        </label>

        <button type="submit" disabled={cart.length === 0 || status === "processing"}>
          {status === "processing" ? "Processing..." : `Checkout · $${total.toFixed(2)}`}
        </button>
      </form>
    </section>
  );
}
// cart empty?    status processing?    disabled?
// ------------------------------------------------
// true           false                 YES
// false          true                  YES
// false          false                 NO
// true           true                  YES