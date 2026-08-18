import { useState } from "react";
import { GAME_ITEMS } from "../data/items";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/catalog/SearchBar";
import ItemGrid from "../components/catalog/ItemGrid";
import Cart from "../components/cart/Cart";
import Checkout from "../components/checkout/Checkout";
import { useCart } from "../context/CartContext";

export default function StorePage({ theme, onThemeToggle }) {
  const [search, setSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

  const filteredItems = GAME_ITEMS.filter((item) =>
    `${item.name} ${item.category} ${item.rarity}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <Navbar
          cartCount={cartCount}
          isCartOpen={isCartOpen}
          onCartToggle={() => setIsCartOpen((open) => !open)}
        />

        {isCartOpen && (
          <div className="cart-popover" id="cart-popover">
            <Cart />
          </div>
        )}

        <div className="hero-copy">
          <p className="eyebrow">Hook Map Project</p>
          <h1>Build your game loadout.</h1>
          <p className="subtitle">
            Browse static game items, add them to your cart, and manage quantities.
          </p>
        </div>
      </header>

      <main>
        <section className="catalog-section">
          <SearchBar value={search} onChange={setSearch} />
          <ItemGrid items={filteredItems} />
        </section>

        <section className="checkout-section">
          <Checkout />
        </section>
      </main>

      <Footer theme={theme} onThemeToggle={onThemeToggle} />
    </div>
  );
}
