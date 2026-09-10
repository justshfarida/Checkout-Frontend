import { Link } from "react-router";
import Cart from "./Cart";

import "./CartPopover.css";

export default function CartPopover() {
  return (
    <div className="cart-popover">
      <Cart />

      <Link
        to="/checkout"
        className="cart-popover__checkout"
      >
        Go to checkout
      </Link>
    </div>
  );
}