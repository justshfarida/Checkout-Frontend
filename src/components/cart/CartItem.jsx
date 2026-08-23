import { useCart } from "../../context/CartContext";

import "./CartItem.css";

export default function CartItem({ item }) {
  const {
    increment,
    decrement,
    remove,
  } = useCart();

  const lineTotal = item.price * item.quantity;

  return (
    <article className="cart-item">

      {/* Product image + information */}
      <div className="cart-item__product">
        <div
          className={`cart-item__visual cart-item__visual--${item.variant}`}
        >
          <span className="cart-item__initial">
            {item.initial}
          </span>
        </div>

        <div className="cart-item__info">
          <h2 className="cart-item__name">
            {item.name}
          </h2>

          <p className="cart-item__stock">
            {item.stock} in stock
          </p>
        </div>
      </div>

      {/* Quantity */}
      <div className="cart-item__quantity">
        <button
          className="cart-item__quantity-button"
          type="button"
          onClick={() => decrement(item.id)}
          aria-label={`Decrease ${item.name} quantity`}
        >
          −
        </button>

        <span className="cart-item__quantity-value">
          {item.quantity}
        </span>

        <button
          className="cart-item__quantity-button"
          type="button"
          onClick={() => increment(item.id)}
          aria-label={`Increase ${item.name} quantity`}
        >
          +
        </button>
      </div>

      {/* Price */}
      <strong className="cart-item__total">
        ${lineTotal.toFixed(2)}
      </strong>

      {/* Remove */}
      <button
        className="cart-item__remove"
        type="button"
        onClick={() => remove(item.id)}
        aria-label={`Remove ${item.name} from cart`}
      >
        ×
      </button>

    </article>
  );
}