import { useState } from "react";
import { PRODUCTS } from "./data/products";
import ItemPage from "./components/ItemPage";
import CheckoutForm from "./components/CheckOutForm";

function App() {
  //
  const [quantity, setQuantity] = useState(1);

  const product = PRODUCTS[0];

  return (
    <>
      <ItemPage
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      <CheckoutForm
        product={product}
        quantity={quantity}
      />
    </>
  );
}

export default App;
  //                  App
  //             quantity = 1
  //            /            \
  //           ↓              ↓
  //      ItemPage       CheckoutForm
  //         │                │
  //  changes quantity     reads quantity