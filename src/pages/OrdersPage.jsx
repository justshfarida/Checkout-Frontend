import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import OrderCard from "../components/checkout/OrderCard";
// import OrderSkeleton from "../components/checkout/OrderSkeleton";

import api from "../api/client";

import "./OrdersPage.css";

const ORDERS_PER_PAGE = 5;

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [cursor, setCursor] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function fetchOrders(
    currentCursor = ""
  ) {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get(
        "/user/orders/cursor",
        {
          params: {
            limit: ORDERS_PER_PAGE,

            ...(currentCursor && {
              cursor: currentCursor,
            }),
          },
        }
      );

      const newOrders =
        response.data.orders ?? [];

      setOrders((currentOrders) => [
        ...currentOrders,
        ...newOrders,
      ]);

      setCursor(
        response.data.next_cursor ?? ""
      );

      setHasMore(
        response.data.has_more ?? false
      );
    } catch (error) {
      console.error(error);

      setError(
        "Your orders could not be loaded."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  function handleLoadMore() {
    if (
      isLoading ||
      !hasMore ||
      !cursor
    ) {
      return;
    }

    fetchOrders(cursor);
  }

  return (
    <div className="orders-page">
      <Navbar />

      <main className="orders-page__main">
        <h1 className="orders-page__title">
          Your orders
        </h1>

        {error && (
          <p className="orders-page__error">
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          orders.length === 0 && (
            <div className="orders-page__empty">
              <h2>No orders yet</h2>

              <p>
                Orders you place will
                show up here.
              </p>
            </div>
          )}

        {orders.length > 0 && (
          <div className="orders-page__list">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
        )}

        {isLoading && (
          <p className="orders-page__message">
            Loading...
          </p>
        )}

        {!isLoading && hasMore && (
          <button
            type="button"
            className="orders-page__load-more"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        )}
      </main>
    </div>
  );
}