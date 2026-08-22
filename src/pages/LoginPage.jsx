import { useState } from "react";
import { useNavigate } from "react-router";

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
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      login(response.data.jwt);

      localStorage.setItem(
        "refreshToken",
        response.data.refresh_token
      );
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
        return;
      }

      if (error.response.status === 422) {
        setError("User does not exist.");
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
                className="login-card__input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
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
            <a
              href="#"
              className="login-card__signup-link"
            >
              Create one
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}