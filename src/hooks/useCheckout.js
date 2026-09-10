import { useState } from "react";

import api from "../api/client";

export function useCheckout() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  async function checkout() {
    if (status === "processing") return;

    try {
      setStatus("processing");
      setError("");

      const idempotencyKey =
        crypto.randomUUID();

      const response = await api.post(
        "/orders",
        null,
        {
          headers: {
            "Idempotency-Key":
              idempotencyKey,
          },
        }
      );

      setOrder(response.data.order);
      setStatus("success");

      return response.data;
    } catch (error) {
      console.error(error);

      if (!error.response) {
        setError(
          "Cannot reach the server."
        );
        setStatus("error");
        return;
      }

      if (
        error.response.status === 401
      ) {
        setError(
          "Your session has expired."
        );
        setStatus("unauthorized");
        return;
      }

      if (
        error.response.status === 402
      ) {
        setError(
          "Payment was declined."
        );
        setStatus("error");

        return error.response.data;
      }

      if (
        error.response.data?.error ===
        "EMPTY_CART"
      ) {
        setError(
          "Your cart is empty."
        );
        setStatus("error");
        return;
      }

      if (
        error.response.data?.error ===
        "INSUFFICIENT_STOCK"
      ) {
        setError(
          "One or more items are no longer available in the requested quantity."
        );
        setStatus("error");
        return;
      }

      setError(
        "The order could not be placed. Please try again."
      );
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setError("");
    setOrder(null);
  }

  return {
    status,
    error,
    order,
    checkout,
    reset,
  };
}