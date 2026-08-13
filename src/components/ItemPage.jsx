import "./itemPage.css";
export default function ItemPage({ product, quantity, setQuantity }) {
  // const [quantity, setQuantity]=useState(1)
   function increaseQuantity() {
    setQuantity((q) => q + 1);
  }

  function decreaseQuantity() {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  }
    const total = product.price * quantity;


  return (
    <div className="item-page">
      <img src={product.imageUrl} alt={product.name} />

      <h2>{product.name}</h2>

      <p>${product.price}</p>

      <div className="quantity-control">
        <button onClick={decreaseQuantity}>-</button>
        <span>{quantity}</span>
        <button onClick={increaseQuantity}>+</button>
      </div>

      <p>Total: ${total.toFixed(2)}</p>

    </div>
  );
}
//