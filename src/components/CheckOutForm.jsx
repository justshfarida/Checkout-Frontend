import { useState } from "react";
import { PRODUCTS } from "../data/products";
import "./checkoutForm.css";

export default function CheckoutForm({ cart, setCart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const cartItems = cart.map((cartItem) => {
    const product = PRODUCTS.find(
      (product) => product.id === cartItem.productId
    );

    return {
      ...cartItem,
      product,
      subtotal: product.price * cartItem.quantity,
    };
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  function handleSubmit(event) {
    event.preventDefault();

    const order = {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      total,
      customer: {
        name,
        email,
        address,
      },
    };

    console.log(order);
  }

  return (
    <div className="checkout-page">
      <div className="order-summary">
        <h2>Order Summary</h2>

        {cartItems.length === 0 && (
          <p>Your cart is empty.</p>
        )}

        {cartItems.map((item) => (
          <div
            className="summary-product"
            key={item.productId}
          >
            <div>
              <h3>{item.product.name}</h3>

              <p>
                ${item.product.price.toFixed(2)}
                {" × "}
                {item.quantity}
              </p>
            </div>

            <span>
              ${item.subtotal.toFixed(2)}
            </span>
          </div>
        ))}

        <div className="summary-row total-row">
          <strong>Total</strong>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>

      <form
        className="checkout-form"
        onSubmit={handleSubmit}
      >
        <h2>Checkout details</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(event) =>
            setAddress(event.target.value)
          }
        />

        <button
          type="submit"
          disabled={cart.length === 0}
        >
          Place order
        </button>
      </form>
    </div>
  );
}