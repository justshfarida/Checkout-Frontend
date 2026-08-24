import { useEffect, useReducer } from "react";

import Navbar from "../components/layout/Navbar";
import OrderCard from "../components/checkout/OrderCard";

import { useCart } from "../context/CartContext";

import api from "../api/client";

import {
  requestReducer,
  initialRequestState,
} from "../reducers/requestReducer";

import "./OrdersPage.css";

export default function OrdersPage() {
  const [state, dispatch] = useReducer(
    requestReducer,
    initialRequestState
  );

  const { cartCount } = useCart();

  useEffect(() => {
    async function fetchOrders() {
      dispatch({
        type: "LOADING",
      });

      try {
        const response = await api.get("/user/orders");

        dispatch({
          type: "SUCCESS",
          payload: response.data,
        });
      } catch (error) {
        console.error(error);

        dispatch({
          type: "ERROR",
          payload: "Your orders could not be loaded.",
        });
      }
    }

    fetchOrders();
  }, []);

  const {
    data: orders,
    isLoading,
    error,
  } = state;

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

              <p>
                Orders you place will show up here.
              </p>
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