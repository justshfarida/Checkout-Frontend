import { useState } from "react";
import { Link, useNavigate } from "react-router";

import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("you@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setError("Email or password is incorrect.");
      return;
    }

    setError("");
    navigate("/checkout");
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
                  error ? "login-card__input--error" : ""
                }`}
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
              />

              {error && (
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
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
              />
            </label>

            <button
              className="login-card__submit"
              type="submit"
            >
              Sign in
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