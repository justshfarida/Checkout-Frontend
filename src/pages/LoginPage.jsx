import { useState } from "react";
import {Link,  useNavigate } from "react-router";

import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth();
  const { syncGuestCartToServer } = useCart();

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    // user starts correcting input
    setIsAuthError(false);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      setIsAuthError(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setIsAuthError(false);

      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      login(response.data.jwt);

      await syncGuestCartToServer();

      navigate("/checkout");
    } catch (error) {
      console.error(error);

      if (!error.response) {
        setError("Cannot reach the server.");
        return;
      }

      if (error.response.status === 401) {
        setError("Email or password is incorrect.");
        setIsAuthError(true);
        return;
      }

      setError("Could not sign in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-page__content">
        <div className="login-page__brand">
          <img
            className="login-page__logo"
            src="/images/Mark.png"
            alt=""
          />

          <span>Xsolla Store</span>
        </div>

        <section className="login-card">
          <h1 className="login-card__title">
            Sign in
          </h1>

          <p className="login-card__subtitle">
            Sign in to continue to checkout.
          </p>

          {error && (
            <p className="login-card__error-banner">
              {error}
            </p>
          )}

          <form
            className="login-card__form"
            onSubmit={handleSubmit}
          >
            <label className="login-card__field">
              <span className="login-card__label">
                Email
              </span>

              <input
                className={`login-card__input ${
                  isAuthError
                    ? "login-card__input--error"
                    : ""
                }`}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />

              {isAuthError && (
                <span className="login-card__field-error">
                  {error}
                </span>
              )}
            </label>

            <label className="login-card__field">
              <span className="login-card__label">
                Password
              </span>

              <input
                className="login-card__input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </label>

            <button
              className="login-card__submit"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          <p className="login-card__signup">
            No account yet?{" "}
            <Link
              to="/signup"
              className="login-card__signup-link"
            >
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}