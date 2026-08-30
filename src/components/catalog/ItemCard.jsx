import { useCart } from "../../context/CartContext";
import "./ItemCard.css";

export default function ItemCard({ item }) {
  const { addToCart } = useCart();

  return (
    <article
      className={`item-card ${
        item.soldOut ? "item-card--sold-out" : ""
      }`}
    >
      <div
        className={`item-card__visual item-card__visual--${item.variant}`}
      >
        <span className="item-card__initial">
          {item.initial}
        </span>
      </div>

      <div className="item-card__body">
        <h3 className="item-card__title">
          {item.name}
        </h3>

        <p className="item-card__description">
          {item.description}
        </p>

        <div className="item-card__footer">
          <strong className="item-card__price">
            ${(item.price/100).toFixed(2)}
          </strong>

          <button
            className="item-card__button"
            type="button"
            disabled={item.soldOut}
            onClick={() => addToCart(item)}
          >
            {item.soldOut ? "Sold out" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}