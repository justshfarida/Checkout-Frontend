import { useCart } from "../../context/CartContext";

export default function ItemCard({ item }) {
  const { addToCart } = useCart();

  return (
    <article className="item-card">
      <img className="item-image" src={item.image} alt={item.name} />
      <div className="rarity">{item.rarity}</div>
      <h3>{item.name}</h3>
      <p>{item.category}</p>
      <div className="item-bottom">
        <strong>${item.price.toFixed(2)}</strong>
        <button onClick={() => addToCart(item)}>Add to Cart</button>
      </div>
    </article>
  );
}
