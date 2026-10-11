import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./PaymentSuccessPage.css";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  const { loadServerCart } = useCart();
  const { loadCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function refreshPaymentState() {
      try {
        await Promise.all([loadServerCart(), loadCurrentUser()]);
      } finally {
        setLoading(false);
      }
    }

    refreshPaymentState();
  }, []);

  if (loading) {
    return (
      <main className="payment-success-page">
        <div className="payment-success-card">
          <p className="payment-success-loading">Confirming your payment...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="payment-success-page">
      <div className="payment-success-card">
        <div className="payment-success-icon">✓</div>

        <h1 className="payment-success-title">Payment successful</h1>

        <p className="payment-success-text">
          Your payment has been completed successfully.
        </p>

        <div className="payment-success-actions">
          <button
            type="button"
            className="payment-success-button"
            onClick={() => navigate("/orders")}
          >
            View orders
          </button>

          <button
            type="button"
            className="
              payment-success-button
              payment-success-button-secondary
            "
            onClick={() => navigate("/")}
          >
            Continue shopping
          </button>
        </div>
      </div>
    </main>
  );
}
