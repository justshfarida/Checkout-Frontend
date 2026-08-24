import { useState } from "react";

import api from "../api/client";

export function useCheckout() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  async function checkout(cart, total) {
    if (status === "processing") return;

    try {
      setStatus("processing");
      setError("");

      const lineItems = cart.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,

        // frontend dollars -> backend cents
        price: Math.round(item.price * 100),
      }));

      const totalInCents = Math.round(total * 100);

      const idempotencyKey = crypto.randomUUID();

      const response = await api.post(
        "/orders",
        {
          line_items: lineItems,
          total: totalInCents,
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      setOrder(response.data.order);
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
// import { useEffect, useRef, useState } from "react";

// export function useCheckout() {
//   const [status, setStatus] = useState("idle");
//   const timeoutRef = useRef(null);

//   useEffect(() => { 
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   function checkout(order) {
//     if (status === "processing") return;

//     setStatus("processing");
//     console.log("Order submitted:", order);

//     timeoutRef.current = setTimeout(() => {
//       setStatus("success");
//     }, 900);
//   }

//   function reset() {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = null;
//     }
//     setStatus("idle");
//   }

//   return { status, checkout, reset };
// }
