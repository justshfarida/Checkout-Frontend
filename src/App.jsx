import {
  useEffect,
  useState,
} from "react";

import { Routes, Route } from "react-router";

import StorePage from "./pages/StorePage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import SignupPage from "./pages/SignupPage";

import Footer from "./components/layout/Footer";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  function handleThemeToggle() {
    setTheme((currentTheme) =>
      currentTheme === "light"
        ? "dark"
        : "light"
    );
  }

  return (
    <div className="page">
      <Routes>
        <Route
          path="/"
          element={<StorePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />

        <Route
          path="/orders"
          element={<OrdersPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />
      </Routes>

      <Footer
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
    </div>
  );
}