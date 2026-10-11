import { useEffect, useState } from "react";

import api from "../api/client";

// crypto.randomUUID() only exists in secure contexts (HTTPS or localhost).
// On plain http://checkout.local it is undefined, so fall back to building a
// version-4 UUID from crypto.getRandomValues(), which works on HTTP too.
function createIdempotencyKey() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

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

      const idempotencyKey = createIdempotencyKey();

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

      // Only a request that was sent but got no reply is a network problem.
      // Anything else (e.g. a bug before sending) must not look like one.
      if (!error.response) {
        setError(
          error.request
            ? "Cannot reach the server."
            : "Something went wrong. Please try again.",
        );
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
