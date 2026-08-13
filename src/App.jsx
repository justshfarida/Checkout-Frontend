import { useState } from "react";
import ItemPage from "./components/ItemPage";
import ProductList from "./components/ProductList";
import CheckoutForm from "./components/CheckOutForm";
import { Routes, Route } from "react-router";

function App() {
  const [quantity, setQuantity] = useState(1);

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
            quantity={quantity}
            setQuantity={setQuantity}
          />
        }
      />

      <Route
        path="/checkout/:id"
        element={
          <CheckoutForm
            quantity={quantity}
          />
        }
      />
    </Routes>
  );
}

export default App;