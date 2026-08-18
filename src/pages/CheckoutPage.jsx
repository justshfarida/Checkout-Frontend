import Navbar from "../components/layout/Navbar";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/checkout/OrderSummary";

import { useCart } from "../context/CartContext";

import "./CheckoutPage.css";

export default function CheckoutPage() {
  const {
    cart,
    cartCount,
  } = useCart();

  return (
    <div className="checkout-page">
      <Navbar
        cartCount={cartCount}
        isCartOpen={false}
        onCartToggle={() => {}}
      />

      <main className="checkout-page__main">
        {cart.length === 0 ? (
          <section className="checkout-page__empty">
            <h1 className="checkout-page__empty-title">
              Your cart is empty
            </h1>

            <p className="checkout-page__empty-text">
              Nothing here yet. The catalogue is one click away.
            </p>
          </section>
        ) : (
          <>
            <section className="checkout-page__cart">
              <h1 className="checkout-page__title">
                Your cart · {cartCount} items
              </h1>

              <div className="checkout-page__items">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </section>

            <OrderSummary />
          </>
        )}
      </main>
    </div>
  );
}