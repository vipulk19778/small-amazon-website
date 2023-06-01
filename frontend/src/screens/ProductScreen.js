import React, { useEffect, useReducer } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from "../components/Rating";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Helmet } from "react-helmet-async";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    product: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, [slug]);

  return (
    <>
      <Link to="/">Back to home</Link>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox></MessageBox>
      ) : (
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
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
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
      )}
    </>
  );
};

export default ProductScreen;
