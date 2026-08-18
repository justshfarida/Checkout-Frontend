export default function Navbar({ cartCount, isCartOpen, onCartToggle }) {
  return (
    <nav className="navbar">
      <a className="store-name" href="#top" aria-label="Game Items Store home">
        Game Items Store
      </a>

      <button
        className="nav-cart-button"
        type="button"
        onClick={onCartToggle}
        aria-expanded={isCartOpen}
        aria-controls="cart-popover"
      >
        <span className="cart-icon" aria-hidden="true">🛒</span>
        <span>Cart</span>
        <span className="cart-badge">{cartCount}</span>
      </button>
    </nav>
  );
}
