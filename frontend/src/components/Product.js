import React from "react";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <div className="border border-[#c0c0c0] bg-[#f8f8f8] rounded-md my-8 mx-8 w-[300px]">
      <a href={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-md w-full"
        />
      </a>

      <div className="p-3">
        <a href={`/product/${product._id}`}>
          <h1 className="text-xl mb-1 py-1">{product.name}</h1>
        </a>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <div className="text-2xl mb-1 py-1">${product.price}</div>
      </div>
    </div>
  );
};

export default Product;
