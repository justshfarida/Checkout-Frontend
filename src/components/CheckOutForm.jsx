import { useState } from "react";
import "./checkoutForm.css";

export default function CheckoutForm({ product, quantity }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
    function handleSubmit(event) {
    event.preventDefault();

    const total = product.price * quantity;

    const order = {
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      total: total,
      customer: {
        name: name,
        email: email,
        address: address,
      },
    };

    console.log(order);
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(event) =>{
            console.log(event);
             setName(event.target.value)}}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />

      <button type="submit">
        Place order
      </button>
    </form>
  );
}