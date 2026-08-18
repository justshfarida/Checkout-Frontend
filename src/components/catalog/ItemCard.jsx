import { useCart } from "../../context/CartContext";
import "./ItemCard.css";

export default function ItemCard({ item }) {
  const { addToCart } = useCart();

  return (
    <article className="item-card">
      <img
        className="item-card__image"
        src={item.image}
        alt={item.name}
      />

      <div className="item-card__body">
        <span className="item-card__rarity">
          {item.rarity}
        </span>

        <h3 className="item-card__title">
          {item.name}
        </h3>

        <p className="item-card__category">
          {item.category}
        </p>

        <div className="item-card__footer">
          <strong className="item-card__price">
            ${item.price.toFixed(2)}
          </strong>

          <button
            className="item-card__button"
            onClick={() => addToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}