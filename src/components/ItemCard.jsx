import { useCart } from "../context/CartContext";

export default function ItemCard({ item }) {
  const { addToCart } = useCart();

  return (
    <article className="item-card">
      <div className="item-icon" aria-hidden="true">{item.icon}</div>
      <div className="rarity">{item.rarity}</div>
      <h3>{item.name}</h3>
      <p>{item.category}</p>
      <div className="item-bottom">
        <strong>${item.price.toFixed(2)}</strong>
        <button onClick={() => addToCart(item)}>Add to cart</button>
      </div>
    </article>
  );
}
