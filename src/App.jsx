import { Routes, Route } from "react-router";

import StorePage from "./pages/StorePage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
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
      </Routes>
    </div>
  );
}