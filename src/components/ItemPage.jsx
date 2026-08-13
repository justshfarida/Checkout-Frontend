import "./itemPage.css";
import { useParams, Link } from "react-router";
import { useState } from "react";
import { PRODUCTS } from "../data/products";

export default function ItemPage({ cart, setCart }) {
  const { id } = useParams();

  const product = PRODUCTS.find(
    (product) => product.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <p>Product not found.</p>;
  }

  function increaseQuantity() {
    setQuantity((q) => q + 1);
  }

  function decreaseQuantity() {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  }

  function addToCart() {
    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        return previousCart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          productId: product.id,
          quantity: quantity,
        },
      ];
    });
  }

  const total = product.price * quantity;

  return (
    <div className="item-page">
      <img
        src={product.imageUrl}
        alt={product.name}
      />

      <h2>{product.name}</h2>

      <p>${product.price}</p>

      <div className="quantity-control">
        <button onClick={decreaseQuantity}>-</button>

        <span>{quantity}</span>

        <button onClick={increaseQuantity}>+</button>
      </div>

      <p>Total: ${total.toFixed(2)}</p>

      <button onClick={addToCart}>
        Add to cart
      </button>

      <Link to="/checkout">
        Go to checkout
      </Link>
    </div>
  );
}