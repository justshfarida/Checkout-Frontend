import Navbar from "../components/layout/Navbar";
import Cart from "../components/cart/Cart";
import OrderSummary from "../components/checkout/OrderSummary";

import { useCart } from "../context/CartContext";

import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { cartCount } = useCart();

  return (
    <div className="checkout-page">
      <Navbar cartCount={cartCount} />

      <main className="checkout-page__main">
        <Cart />

        <OrderSummary />
      </main>
    </div>
  );
}