import { useEffect, useRef, useState } from "react";

export function useCheckout() {
  const [status, setStatus] = useState("idle");
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function checkout(order) {
    if (status === "processing") return;

    setStatus("processing");
    console.log("Order submitted:", order);

    timeoutRef.current = setTimeout(() => {
      setStatus("success");
    }, 900);
  }

  function reset() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus("idle");
  }

  return { status, checkout, reset };
}
