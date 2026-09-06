import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router";

import api from "../api/client";

import "./LoginPage.css";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError(
        "All fields are required."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await api.post("/signup", {
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (error) {
      console.error(error);

      if (!error.response) {
        setError(
          "Cannot reach the server."
        );
        return;
      }

      if (
        error.response.status === 422
      ) {
        setError(
          "Please check your email and password."
        );
        return;
      }

      if (
        error.response.status === 400
      ) {
        setError(
          "Invalid signup information."
        );
        return;
      }

      setError(
        "Could not create account."
      );
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
            Create account
          </h1>

          <p className="login-card__subtitle">
            Create an account to continue
            to checkout.
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

            <label className="login-card__field">
              <span className="login-card__label">
                Confirm password
              </span>

              <input
                className="login-card__input"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
              />
            </label>

            <button
              className="login-card__submit"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="login-card__signup">
            Already have an account?{" "}
            <Link
              to="/login"
              className="login-card__signup-link"
            >
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}