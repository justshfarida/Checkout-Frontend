import "./ItemSkeleton.css";

export default function ItemSkeleton() {
  return (
    <article className="item-skeleton">
      <div className="item-skeleton__visual" />

      <div className="item-skeleton__body">
        <div className="item-skeleton__line item-skeleton__line--title" />

        <div className="item-skeleton__line item-skeleton__line--text" />

        <div className="item-skeleton__line item-skeleton__line--price" />
      </div>
    </article>
  );
}