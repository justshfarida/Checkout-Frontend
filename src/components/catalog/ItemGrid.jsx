import ItemCard from "./ItemCard";
import "./ItemGrid.css";

export default function ItemGrid({ items }) {
  if (items.length === 0) {
    return <p className="empty-state">No items match your search.</p>;
  }

  return (
    <section className="item-grid">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </section>
  );
}
