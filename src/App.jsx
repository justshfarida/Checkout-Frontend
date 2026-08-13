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
  const { cartCount } = useCart();

  const filteredItems = items.filter((item) =>
    `${item.name} ${item.category} ${item.rarity}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Hook Map Project</p>
          <h1>Game Items Store</h1>
          <p className="subtitle">Build your loadout and review React hooks along the way.</p>
        </div>
        <div className="header-cart">Cart <span>{cartCount}</span></div>
      </header>

      <main>
        <section className="catalog-section">
          <SearchBar value={search} onChange={setSearch} />
          <ItemGrid items={filteredItems} />
        </section>

        <section className="checkout-layout">
          <Cart />
          <Checkout />
        </section>
      </main>
    </div>
  );
}
