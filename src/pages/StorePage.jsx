import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ItemGrid from "../components/catalog/ItemGrid";

import { useCart } from "../context/CartContext";

import "./StorePage.css";

const API_URL = import.meta.env.VITE_API_URL;

const variants = [
  "cyan",
  "lime",
  "purple",
  "blue",
  "orange",
  "pink",
];

export default function StorePage({ theme, onThemeToggle }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { cartCount } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/items`);

        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }

        const data = await response.json();

        const formattedItems = data.map((item, index) => ({
          ...item,

          price: item.price / 100,

          initial:
            item.name?.charAt(0).toUpperCase() || "?",

          variant:
            variants[index % variants.length],

          soldOut:
            item.stock <= 0,
        }));

        setItems(formattedItems);
      } catch (error) {
        console.error(error);

        setError("Could not load items.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, []);

  function handleCartClick() {
    navigate("/checkout");
  }

  return (
    <div className="store-page">
      <Navbar
        cartCount={cartCount}
        onCartToggle={handleCartClick}
      />

      <main className="store-page__main">
        <section className="store-page__catalog">
          {isLoading && <p>Loading items...</p>}

          {error && <p>{error}</p>}

          {!isLoading && !error && (
            <ItemGrid items={items} />
          )}
        </section>
      </main>

      <Footer
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
    </div>
  );
}