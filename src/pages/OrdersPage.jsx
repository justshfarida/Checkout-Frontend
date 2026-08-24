import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import OrderCard from "../components/checkout/OrderCard";

import { useCart } from "../context/CartContext";

import api from "../api/client";

import "./OrdersPage.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { cartCount } = useCart();

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/user/orders");

        setOrders(response.data);
      } catch (error) {
        console.error(error);

        setError("Your orders could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <Navbar cartCount={cartCount} />

      <main className="orders-page__main">
        <h1 className="orders-page__title">
          Your orders
        </h1>

        {isLoading && (
          <p className="orders-page__message">
            Loading orders...
          </p>
        )}

        {!isLoading && error && (
          <p className="orders-page__error">
            {error}
            
          </p>
        )}

        {!isLoading &&
          !error &&
          orders.length === 0 && (
            <div className="orders-page__empty">
              <h2>No orders yet</h2>
              <p>Orders you place will show up here.</p>
            </div>
          )}

        {!isLoading &&
          !error &&
          orders.length > 0 && (
            <div className="orders-page__list">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                />
              ))}
            </div>
          )}
      </main>
    </div>
  );
}