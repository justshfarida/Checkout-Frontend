import { useState } from "react";
import { Routes, Route } from "react-router";

import ProductList from "./components/ProductList";
import ItemPage from "./components/ItemPage";
import CheckoutForm from "./components/CheckOutForm";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Routes>
      <Route
        path="/"
        element={<ProductList />}
      />

      <Route
        path="/products/:id"
        element={
          <ItemPage
            cart={cart}
            setCart={setCart}
          />
        }
      />

      <Route
        path="/checkout"
        element={
          <CheckoutForm
            cart={cart}
            setCart={setCart}
          />
        }
      />
    </Routes>
  );
}

export default App;
    //                 App
    //              cart state
    //                  │
    //        ┌─────────┴─────────┐
    //        │                   │
    //        ▼                   ▼
    //    ItemPage          CheckoutForm
    //        │                   │
    //  Add to cart          reads cart
    //        │                   │
    //        └──── setCart ──────┘

// before:
  //                     App
  //              quantity state
  //                    │
  //          ┌─────────┴─────────┐
  //          │                   │
  //          ▼                   ▼
  //      ItemPage          CheckoutForm
  //          │                   │
  //  changes quantity       reads quantity
  //    setQuantity              │
  //          │                   │
  //          └────── App ────────┘