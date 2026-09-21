import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleMenuToggle() {
    setIsMenuOpen((open) => !open);
  }

  function handleMenuClose() {
    setIsMenuOpen(false);
  }

  function handleLogout() {
    logout();

    setIsMenuOpen(false);

    navigate("/");
  }

  return (
    <>
      <header className="navbar">
        <Link to="/" className="navbar__brand" onClick={handleMenuClose}>
          <img className="navbar__logo" src="/images/Mark.png" alt="Xsolla" />

          <span className="navbar__brand-name">Xsolla Store</span>
        </Link>

        <nav className="navbar__nav">
          {/* DESKTOP STORE */}
          <Link to="/" className="navbar__desktop-link">
            Store
          </Link>

          {/* DESKTOP ORDERS */}
          {isAuthenticated && (
            <Link to="/orders" className="navbar__desktop-link">
              Orders
            </Link>
          )}
          {isAuthenticated && (
            <div className="navbar__balance">
              <img
                src="/images/coin.svg"
                alt=""
                className="navbar__balance-icon"
              />

              <span>{user?.balance ?? 0} Gold</span>
            </div>  
          )}
          {/* CART */}
          <Link
            to="/checkout"
            className="navbar__cart"
            onClick={handleMenuClose}
          >
            <img
              className="navbar__cart-icon"
              src="/images/CartIcon.png"
              alt=""
            />

            <span className="navbar__cart-text">Cart</span>

            {cartCount > 0 && (
              <span className="navbar__cart-badge">{cartCount}</span>
            )}
          </Link>

          {/* DESKTOP AUTH BUTTON */}
          {isAuthenticated ? (
            <button
              className="navbar__logout navbar__desktop-auth"
              type="button"
              onClick={handleLogout}
            >
              Sign out
            </button>
          ) : (
            <Link to="/login" className="navbar__login">
              Login
            </Link>
          )}

          {/* MOBILE HAMBURGER ONLY WHEN AUTHENTICATED */}
          {isAuthenticated && (
            <button
              className="navbar__menu-button"
              type="button"
              onClick={handleMenuToggle}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span />
              <span />
              <span />
            </button>
          )}
        </nav>

        {/* MOBILE AUTHENTICATED MENU */}
        {isAuthenticated && isMenuOpen && (
          <div className="navbar__mobile-menu">
            <Link
              to="/"
              className="navbar__mobile-link"
              onClick={handleMenuClose}
            >
              Store
            </Link>

            <Link
              to="/orders"
              className="navbar__mobile-link"
              onClick={handleMenuClose}
            >
              Orders
            </Link>

            <button
              className="navbar__mobile-link navbar__mobile-signout"
              type="button"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* DARK OVERLAY */}
      {isAuthenticated && isMenuOpen && (
        <button
          className="navbar__overlay"
          type="button"
          onClick={handleMenuClose}
          aria-label="Close navigation menu"
        />
      )}
    </>
  );
}
