import { Link } from "react-router";

import "./Navbar.css";

export default function Navbar({
  cartCount,
  isCartOpen,
  onCartToggle,
}) {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <img
        className="navbar__logo"
        src="/images/Mark.png"
        alt="Xsolla"
      />
        <span>Xsolla Store</span>
      </Link>

      <nav className="navbar__nav">
        <Link to="/" className="navbar__link">
          Store
        </Link>

      <button
          className="navbar__cart"
          type="button"
          onClick={onCartToggle}
          aria-expanded={isCartOpen}
          aria-controls="cart-popover"
        >
          <img
            className="navbar__cart-icon"
            src="/images/CartIcon.png"
            alt=""
          />

          <span className="navbar__cart-text">Cart</span>

          {cartCount > 0 && (
            <span className="navbar__cart-badge">
              {cartCount}
            </span>
          )}
      </button>

        <Link to="/login" className="navbar__login">
          Login
        </Link>
      </nav>
    </header>
  );
}