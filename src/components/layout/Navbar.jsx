import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

export default function Navbar({ cartCount }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <img
          className="navbar__logo"
          src="/images/Mark.png"
          alt="Xsolla"
        />

        <span className="navbar__brand-name">Xsolla Store</span>
      </Link>

      <nav className="navbar__nav">
        <Link to="/" className="navbar__link">
          Store
        </Link>

        {isAuthenticated && (
          <Link
            to="/orders"
            className="navbar__link"
          >
            Orders
          </Link>
        )}

        <Link
          to="/checkout"
          className="navbar__cart"
        >
          <img
            className="navbar__cart-icon"
            src="/images/CartIcon.png"
            alt=""
          />

          <span className="navbar__cart-text">
            Cart
          </span>

          {cartCount > 0 && (
            <span className="navbar__cart-badge">
              {cartCount}
            </span>
          )}
        </Link>

        {isAuthenticated ? (
          <button
            className="navbar__logout"
            type="button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/login"
            className="navbar__login"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}