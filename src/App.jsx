import { Routes, Route } from "react-router";

import StorePage from "./pages/StorePage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrdersPage";
import { useLocalStorage } from "./hooks/useLocalStorage";

const THEME_STORAGE_KEY = "game-items-store-theme";

export default function App() {
  const [theme, setTheme] = useLocalStorage(
    THEME_STORAGE_KEY,
    "light"
  );

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  return (
    <div className={`page ${theme}`}>
      <Routes>
        <Route
          path="/"
          element={
            <StorePage
            />
          }
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
        element={<OrderPage />}
      />
    </Routes>
    </div>
  );
}