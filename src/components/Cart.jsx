import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, cartCount, total, increment, decrement, remove } = useCart();

  return (
    <aside className="cart-panel">
      <div className="cart-heading">
        <div>
          <p className="eyebrow">Your loadout</p>
          <h2>Cart</h2>
        </div>
        <span className="cart-badge">{cartCount}</span>
      </div>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty. Add an item to start your loadout.</p>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-main">
                <span className="cart-item-icon">{item.icon}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>${item.price.toFixed(2)} each</small>
                </div>
              </div>

              <div className="cart-actions">
                <button onClick={() => decrement(item.id)} aria-label={`Decrease ${item.name}`}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increment(item.id)} aria-label={`Increase ${item.name}`}>+</button>
                <button className="remove" onClick={() => remove(item.id)}>Remove</button>
              </div>

              <div className="cart-line-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-total">
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </aside>
  );
}
