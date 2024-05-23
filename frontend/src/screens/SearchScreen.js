import React, { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getError } from "../utils";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Rating from "../components/Rating";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },
  {
    name: "3stars & up",
    rating: 3,
  },
  {
    name: "2stars & up",
    rating: 2,
  },
  {
    name: "1stars & up",
    rating: 1,
  },
];

const SearchScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [categories, setCategories] = useState([]);

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };

  return (
    <>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Grid container>
        <Grid item md={3}>
          <Box>
            <Typography variant="h3">Department</Typography>
            <List>
              <ListItem sx={{ fontWeight: "all" === category ? "bold" : "" }}>
                <Link to={getFilterUrl({ category: "all" })}>Any</Link>
              </ListItem>
              {categories?.map((c) => (
                <ListItem
                  key={c}
                  sx={{ fontWeight: c === category ? "bold" : "" }}
                >
                  <Link to={getFilterUrl({ category: c })}>{c}</Link>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box>
            <Typography variant="h3">Price</Typography>
            <List>
              <ListItem sx={{ fontWeight: "all" === price ? "bold" : "" }}>
                <Link to={getFilterUrl({ price: "all" })}>Any</Link>
              </ListItem>
              {prices?.map((p) => (
                <ListItem
                  key={p?.value}
                  sx={{ fontWeight: p?.value === price ? "bold" : "" }}
                >
                  <Link to={getFilterUrl({ price: p?.value })}>{p?.name}</Link>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box>
            <Typography variant="h3">Avg. Customer Review</Typography>
            <List>
              {ratings?.map((r) => (
                <ListItem
                  key={r?.name}
                  sx={{ fontWeight: r?.rating === rating ? "bold" : "" }}
                >
                  <Link to={getFilterUrl({ rating: r?.rating })}>
                    <Rating caption={" & up"} rating={r?.rating}></Rating>
                  </Link>
                </ListItem>
              ))}
              <ListItem sx={{ fontWeight: "all" === rating ? "bold" : "" }}>
                <Link to={getFilterUrl({ rating: "all" })}>
                  <Rating caption={" & up"} rating={0}></Rating>
                </Link>
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Grid container>
                <Grid item md={6}>
                  <Box>
                    {countProducts === 0 ? "No" : countProducts} Results
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {price !== "all" && " : Price " + price}
                    {rating !== "all" && " : Rating " + rating}
                    {query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all" ? (
                      <Button
                        variant="outlined"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </Box>
                </Grid>
                <Grid item md={6}>
                  Sort by{" "}
                  <Select
                    value={order}
                    size="small"
                    onChange={(e) =>
                      navigate(getFilterUrl({ order: e.target.value }))
                    }
                  >
                    <MenuItem value="newest">Newest Arrivals</MenuItem>
                    <MenuItem value="lowest">Price: Low to High</MenuItem>
                    <MenuItem value="highest">Price: High to Low</MenuItem>
                    <MenuItem value="toprated">Avg. Customer Reviews</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              {products?.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}

              <Grid container>
                {products?.map((product) => (
                  <Grid item sm={6} lg={4} key={product?._id} mb={3}>
                    <Product product={product}></Product>
                  </Grid>
                ))}
              </Grid>

              <Box>
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    to={getFilterUrl({ page: x + 1 })}
                    style={{ margin: "0 2px" }}
                  >
                    <Button
                      variant={
                        Number(page) === x + 1 ? "contained" : "outlined"
                      }
                      sx={{
                        fontWeight: Number(page) === x + 1 ? "bold" : "",
                        px: 0,
                      }}
                    >
                      {x + 1}
                    </Button>
                  </Link>
                ))}
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default SearchScreen;
