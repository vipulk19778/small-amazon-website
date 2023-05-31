import React from "react";
import Product from "../components/Product";
import data from "../data";

const HomeScreen = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {data.products.map((product) => (
        <Product key={product._id} product={product}></Product>
      ))}
    </div>
  );
};

export default HomeScreen;
