import { useState } from "react";

import { STORE_ITEMS } from "../data/items";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ItemGrid from "../components/catalog/ItemGrid";
import CartPopover from "../components/cart/CartPopover";

import { useCart } from "../context/CartContext";

import "./StorePage.css";

export default function StorePage({ theme, onThemeToggle }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartCount } = useCart();

  function handleCartToggle() {
    setIsCartOpen((open) => !open);
  }

  return (
    <div className="store-page">
      <Navbar
        cartCount={cartCount}
        isCartOpen={isCartOpen}
        onCartToggle={handleCartToggle}
      />

      {isCartOpen && (
        <CartPopover />
      )}

      <main className="store-page__main">
        <section className="store-page__catalog">
          <ItemGrid items={STORE_ITEMS} />
        </section>
      </main>

      <Footer
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
    </div>
  );
}