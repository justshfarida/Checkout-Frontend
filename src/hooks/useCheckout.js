import { useEffect, useState } from "react";

import api from "../api/client";

export function useCheckout() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  // When the user leaves for Pay Station and presses Back, the browser can
  // restore this page from its back/forward cache with the old state
  // ("Processing..." and a stale cart). Reset checkout and reload the page
  // so the button works again and the cart is fetched fresh.
  useEffect(() => {
    function handlePageShow(event) {
      if (event.persisted) {
        window.location.reload();
      }
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  async function checkout() {
    if (status === "processing") return;

    try {
      setStatus("processing");
      setError("");

      const idempotencyKey = crypto.randomUUID();

      const response = await api.post("/orders", null, {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      });

      setOrder(response.data.order);
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;

        return response.data;
      }
      setStatus("success");

      return response.data;
    } catch (error) {
      console.error(error);

      if (!error.response) {
        setError("Cannot reach the server.");
        setStatus("error");
        return;
      }

      if (error.response.status === 401) {
        setError("Your session has expired.");
        setStatus("unauthorized");
        return;
      }

      if (error.response.status === 402) {
        setError("Payment was declined.");
        setStatus("error");

        return error.response.data;
      }

      if (error.response.data?.error === "EMPTY_CART") {
        setError("Your cart is empty.");
        setStatus("error");
        return;
      }

      if (error.response.data?.error === "INSUFFICIENT_STOCK") {
        setError(
          "One or more items are no longer available in the requested quantity.",
        );
        setStatus("error");
        return;
      }

      setError("The order could not be placed. Please try again.");
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
