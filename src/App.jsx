import { useState } from "react";
import { GAME_ITEMS } from "./data/items";
import SearchBar from "./components/SearchBar";
import ItemGrid from "./components/ItemGrid";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import { useCart } from "./context/CartContext";

export default function App() {
  const [items] = useState(GAME_ITEMS);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("dark");

  const { cartCount } = useCart();

  // Searching logic
  const filteredItems = items.filter((item) =>
    `${item.name} ${item.category} ${item.rarity}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className={`page ${theme}`}>
      <div className="app-shell">

        <header className="site-header">
          <div>
            <p className="eyebrow">Hook Map Project</p>
            <h1>Game Items Store</h1>
            <p className="subtitle">
              Build your loadout and review React hooks along the way.
            </p>
          </div>

          <div className="header-cart">
            Cart <span>{cartCount}</span>
          </div>
        </header>

        <main>
          <section className="catalog-section">
            <SearchBar
              value={search}
              onChange={setSearch}
            />

            <ItemGrid items={filteredItems} />
          </section>

          <section className="checkout-layout">
            <Cart />
            <Checkout />
          </section>
        </main>

        <footer>
          <span>React Hooks Project</span>

          <button
            className="theme-toggle"
            onClick={() =>
              setTheme((currentTheme) =>
                currentTheme === "dark" ? "light" : "dark"
              )
            }
          >
            {theme === "dark"
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>
        </footer>

      </div>
    </div>
  );
}