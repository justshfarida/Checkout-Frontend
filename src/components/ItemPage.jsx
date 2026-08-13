import "./itemPage.css";
import { useParams, Link } from "react-router";
import { PRODUCTS } from "../data/products";

export default function ItemPage({
  quantity,
  setQuantity
}) {
  const { id } = useParams();

  const product = PRODUCTS.find(
    (product) => product.id === Number(id)
  );

  if (!product) {
    return <p>Product not found</p>;
  }

  function increaseQuantity() {
    setQuantity((q) => q + 1);
  }

  function decreaseQuantity() {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
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
        <button onClick={decreaseQuantity}>
          -
        </button>

        <span>{quantity}</span>

        <button onClick={increaseQuantity}>
          +
        </button>
      </div>

      <p>Total: ${total.toFixed(2)}</p>

      <Link to={`/checkout/${product.id}`}>
        Checkout
      </Link>
    </div>
  );
}