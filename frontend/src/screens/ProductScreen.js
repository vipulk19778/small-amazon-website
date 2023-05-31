import React from "react";
import data from "../data";
import { useParams, Link } from "react-router-dom";
import Rating from "../components/Rating";

const ProductScreen = () => {
  const { id } = useParams();
  const product = data.products.find((x) => x._id === parseInt(id));
  if (!product) {
    return <div>Product Not Found</div>;
  }

  return (
    <>
      <Link to="/">Back to home</Link>
      <div className="lg:flex">
        <div className="lg:w-[40%] lg:mr-[5%] items-start lg:px-10">
          <img src={product.image} alt={product.name} className="h-[80vh]" />
        </div>
        <div className="lg:w-[25%] lg:mr-[5%] items-start">
          <ul>
            <li>
              <h1>{product.name}</h1>
            </li>
            <li>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </li>
            <li>Price: ${product.price}</li>
            <li>
              Description: <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div className="lg:w-[25%] items-start">
          <div>
            <ul>
              <li>
                <div>Price</div>
                <div>${product.price}</div>
              </li>
              <li>
                <div>Status</div>
                <div>
                  $
                  {product.countInStock > 0 ? (
                    <span className="bg-[green]">In Stock</span>
                  ) : (
                    <span className="bg-[crimson]">Unavailable</span>
                  )}
                </div>
              </li>
              <li>
                <button>Add to Cart</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductScreen;
