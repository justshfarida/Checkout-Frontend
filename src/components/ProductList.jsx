import { useState } from "react";
import Product from "./Product";

import { PRODUCTS } from "../data/products";

export default function ProductList() {
  const [products, setProducts] = useState(PRODUCTS);

  function addProduct() {
    const id = (products[products.length - 1].id ?? 0) + 1;

    const product = {
      id,
      name: `Product ${id}`,
      price: 6.99,
    };

    setProducts((prevValues) => [...prevValues, product]);
  }

  return (
    <div className="products">
      {products.length > 0 &&
        products.map((product) => (
          <Product product={product} key={product.id} />
        ))}
      <button className="add-button" onClick={addProduct}>
        Add new product
      </button>
    </div>
  );
}
