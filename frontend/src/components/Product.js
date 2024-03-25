import React, { useContext } from "react";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { Button } from "@mui/material";

const Product = ({ product }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  return (
    <div className="border border-[#c0c0c0] bg-[#f8f8f8] rounded-md my-8 mx-8 w-[300px]">
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-md w-full"
        />
      </Link>

      <div className="p-3">
        <Link to={`/product/${product.slug}`}>
          <h1 className="text-xl mb-1 py-1">{product.name}</h1>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <div className="text-2xl mb-1 py-1">${product.price}</div>
        {product.countInStock === 0 ? (
          <Button variant="contained" disabled>
            Out of stock
          </Button>
        ) : (
          <Button variant="contained" onClick={() => addToCartHandler(product)}>
            Add to cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default Product;
