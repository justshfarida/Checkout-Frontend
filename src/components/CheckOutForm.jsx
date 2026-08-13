import { useState } from "react";
import { useParams } from "react-router";
import { PRODUCTS } from "../data/products";
import "./checkoutForm.css";

export default function CheckoutForm({ quantity }) {
  const { id } = useParams();

  const product = PRODUCTS.find(
    (product) => product.id === Number(id)
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  if (!product) {
    return <p>Product not found.</p>;
  }

  const total = product.price * quantity;

  function handleSubmit(event) {
    event.preventDefault();

    const order = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
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

        <div className="summary-product">
          <div>
            <h3>{product.name}</h3>
            <p>Quantity: {quantity}</p>
          </div>

          <span>
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>

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

        <button type="submit">
          Place order
        </button>
      </form>
    </div>
  );
}