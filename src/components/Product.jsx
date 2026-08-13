import "./product.css";
import { Link } from "react-router";

export default function Product({ product }) {
   return (
    <Link
      to={`/products/${product.id}`}
      className="product-link"
    >
      <div className="product">
        <div>
          <h3>{product.name}</h3>
          <p>Digital product</p>
        </div>

        <span className="price">
          ${product.price}
        </span>
      </div>
    </Link>
  );
}
