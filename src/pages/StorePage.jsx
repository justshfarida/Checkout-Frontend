import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ItemGrid from "../components/catalog/ItemGrid";

import { useCart } from "../context/CartContext";

import {
  requestReducer,
  initialRequestState,
} from "../reducers/requestReducer";

import api from "../api/client";

import "./StorePage.css";

const variants = [
  "cyan",
  "lime",
  "purple",
  "blue",
  "orange",
  "pink",
];

export default function StorePage({
  theme,
  onThemeToggle,
}) {
  const [state, dispatch] = useReducer(
    requestReducer,
    initialRequestState
  );

  const { cartCount } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      dispatch({
        type: "LOADING",
      });

      try {
        const response = await api.get("/items");

        const data = response.data;

        const safeItems = Array.isArray(data)
          ? data
          : [];

        const formattedItems = safeItems.map(
          (item, index) => ({
            ...item,

            // backend cents -> frontend dollars
            price: item.price / 100,

            // UI-specific values
            initial:
              item.name
                ?.charAt(0)
                .toUpperCase() || "?",

            variant:
              variants[
                index % variants.length
              ],

            soldOut:
              item.stock <= 0,
          })
        );

        dispatch({
          type: "SUCCESS",
          payload: formattedItems,
        });
      } catch (error) {
        console.error(error);

        dispatch({
          type: "ERROR",
          payload:
            "The catalogue could not be loaded.",
        });
      }
    }

    fetchItems();
  }, []);

  const {
    data: items,
    isLoading,
    error,
  } = state;

  function handleCartClick() {
    navigate("/checkout");
  }

  return (
    <div className="store-page">
      <Navbar
        cartCount={cartCount}
        onCartClick={handleCartClick}
      />

      <main className="store-page__main">
        <section className="store-page__catalog">
          {isLoading && (
            <p className="store-page__message">
              Loading items...
            </p>
          )}

          {!isLoading && error && (
            <div className="store-page__error">
              <h2 className="store-page__error-title">
                {error}
              </h2>

              <p className="store-page__error-text">
                Check that checkout-api is running.
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            items.length === 0 && (
              <p className="store-page__message">
                No items available.
              </p>
            )}

          {!isLoading &&
            !error &&
            items.length > 0 && (
              <ItemGrid items={items} />
            )}
        </section>
      </main>
    </div>
  );
}