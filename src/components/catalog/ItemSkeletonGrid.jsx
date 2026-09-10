import ItemSkeleton from "./ItemSkeleton";

import "./ItemGrid.css";

export default function ItemSkeletonGrid() {
  return (
    <div className="item-grid">
      {Array.from({ length: 6 }).map((_, index) => (
        <ItemSkeleton key={index} />
      ))}
    </div>
  );
}