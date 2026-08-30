import { useState } from "react";
import { useNavigate } from "react-router";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useCheckout } from "../../hooks/useCheckout";

import "./OrderSummary.css";

export default function OrderSummary() {
  const {
    cart,
    total,
    clearCart,
  } = useCart();

  const {
    isAuthenticated,
  } = useAuth();

  const {
    status,
    error,
    order,
    checkout,
    reset,
  } = useCheckout();

  const navigate = useNavigate();

  const [promoCode, setPromoCode] =
    useState("XSOLLA10");

  async function handleSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const result = await checkout(
      cart,
      total
    );

    if (result) {
      clearCart();
    }
  }

  function startNewOrder() {
    clearCart();
    setPromoCode("");
    reset();
  }

  if (status === "success") {
    return (
      <aside className="order-summary order-summary--success">
        <div className="order-summary__success-icon">
          ✓
        </div>

        <h2 className="order-summary__title">
          Order complete
        </h2>

        <p className="order-summary__message">
          Your order has been placed successfully.
        </p>

        {order && (
          <p className="order-summary__message">
            Order #{order.id}
          </p>
        )}

        <button
          className="order-summary__button"
          type="button"
          onClick={startNewOrder}
        >
          Start a new order
        </button>
      </aside>
    );
  }

  return (
    <aside className="order-summary">
      <h2 className="order-summary__title">
        Order summary
      </h2>

      <div className="order-summary__row">
        <span>Subtotal</span>

        <strong>
          ${total.toFixed(2)}
        </strong>
      </div>

      <div className="order-summary__row">
        <span>Delivery</span>

        <strong>Free</strong>
      </div>

      <form
        className="order-summary__form"
        onSubmit={handleSubmit}
      >
        <label
          className="order-summary__label"
          htmlFor="promo-code"
        >
          Promo code
        </label>

        <input
          id="promo-code"
          className="order-summary__input"
          type="text"
          value={promoCode}
          onChange={(event) =>
            setPromoCode(event.target.value)
          }
          placeholder="XSOLLA10"
        />

        <div className="order-summary__divider" />

        <div className="order-summary__total">
          <strong>Total</strong>

          <strong className="order-summary__total-price">
            ${(total/100).toFixed(2)}
          </strong>
        </div>

        {error && (
          <p className="order-summary__error">
            {error}
          </p>
        )}

        <button
          className="order-summary__button"
          type="submit"
          disabled={
            cart.length === 0 ||
            status === "processing"
          }
        >
          {status === "processing"
            ? "Processing..."
            : "Place order"}
        </button>
      </form>

      <p className="order-summary__terms">
        By placing this order you agree to the Terms of Service.
      </p>
    </aside>
  );
}