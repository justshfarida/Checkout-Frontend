import "./OrderCard.css";

export default function OrderCard({ order }) {
  return (
    <article className="order-card">
      <div className="order-card__header">
        <h2 className="order-card__number">
          Order #{order.id}
        </h2>

        <span className="order-card__status">
          {order.status}
        </span>
      </div>

      <div className="order-card__items">
        {order.items.map((item) => (
          <div
            className="order-card__item"
            key={item.item_id}
          >
            <span className="order-card__item-name">
              {item.name} × {item.quantity}
            </span>

            <span className="order-card__item-price">
              $
              {(
                (item.price * item.quantity) /
                100
              ).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="order-card__divider" />

      <div className="order-card__total">
        <strong>Total</strong>

        <strong className="order-card__total-price">
          ${(order.total / 100).toFixed(2)}
        </strong>
      </div>
    </article>
  );
}