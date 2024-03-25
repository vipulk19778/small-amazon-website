import React, { useContext } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Typography,
  createTheme,
} from "@mui/material";
import {
  AddCircleRounded,
  Delete,
  RemoveCircleRounded,
} from "@mui/icons-material";
import axios from "axios";

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <Typography variant="h2" sx={{ mb: 2, fontWeight: "bold" }}>
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <MessageBox>
          Cart is empty.<Link to="/">Go Shopping</Link>
        </MessageBox>
      ) : (
        <Grid container columnSpacing={4}>
          <Grid item xs={8}>
            {cartItems.map((item, index) => (
              <Grid
                container
                key={index}
                sx={{
                  p: "10px",
                  border: "1px solid #ddd",
                  mt: index === 0 ? 0 : 2,
                  alignItems: "center",
                }}
              >
                <Grid
                  item
                  xs={5}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ height: "80px", maxWidth: "100%" }}
                  ></Box>
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    variant="outlined"
                    disabled={item.quantity === 1}
                    sx={{
                      borderRadius: "5px",
                      minWidth: 0,
                      width: "36px",
                      height: "36px",
                    }}
                    onClick={() => updateCartHandler(item, item.quantity - 1)}
                  >
                    <RemoveCircleRounded />
                  </Button>
                  <Typography variant="h4" sx={{ mx: 2 }}>
                    {item.quantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    disabled={item.quantity === item.countInStock}
                    sx={{
                      borderRadius: "5px",
                      minWidth: 0,
                      width: "36px",
                      height: "36px",
                    }}
                    onClick={() => updateCartHandler(item, item.quantity + 1)}
                  >
                    <AddCircleRounded />
                  </Button>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: "center" }}>
                  {`$${item.price}`}
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "50%",
                      minWidth: 0,
                      width: "36px",
                      height: "36px",
                    }}
                    onClick={() => removeItemHandler(item)}
                  >
                    <Delete sx={{ color: "red" }} />
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold" }}
                >{`Subtotal (${cartItems.reduce((acc, cur) => {
                  return acc + cur.quantity;
                }, 0)} items) : $${cartItems.reduce((acc, cur) => {
                  return acc + cur.price * cur.quantity;
                }, 0)}`}</Typography>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    disabled={cartItems.length === 0}
                    fullWidth
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default CartScreen;
