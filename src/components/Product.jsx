import "./product.css";

export default function Product({ product }) {
  return (
    <div className="product">
      <div>
        <h3>{product.name}</h3>
        <p>Digital product</p>
      </div>

      <span className="price">${product.price}</span>
    </div>
  );
}
