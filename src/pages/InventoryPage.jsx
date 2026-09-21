import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/layout/Navbar";
import api from "../api/client";
import { getItemImage } from "../utils/itemImages";

import "./InventoryPage.css";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadInventory() {
      try {
        const response = await api.get(
          "/user/inventory"
        );

        if (cancelled) {
          return;
        }

        setItems(response.data ?? []);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);

        setError(
          "Your inventory could not be loaded."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="inventory-page">
      <Navbar />

      <main className="inventory-page__main">
        <h1 className="inventory-page__title">
          Your inventory
        </h1>

        {isLoading && (
          <p className="inventory-page__message">
            Loading inventory...
          </p>
        )}

        {error && (
          <p className="inventory-page__error">
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          items.length === 0 && (
            <div className="inventory-page__empty">
              <h2>No items yet</h2>

              <p>
                Virtual items you purchase
                will show up here.
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          items.length > 0 && (
            <div className="inventory-page__grid">
              {items.map((item) => {
                const image = getItemImage(
                  item.id
                );

                return (
                  <article
                    key={item.id}
                    className="inventory-card"
                  >
                    {image && (
                      <div className="inventory-card__visual">
                        <img
                          src={image}
                          alt={item.name}
                          className="inventory-card__image"
                        />
                      </div>
                    )}

                    <div className="inventory-card__content">
                      <h2 className="inventory-card__name">
                        {item.name}
                      </h2>

                      <p className="inventory-card__description">
                        {item.description}
                      </p>

                      <span className="inventory-card__quantity">
                        Owned: {item.quantity}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}