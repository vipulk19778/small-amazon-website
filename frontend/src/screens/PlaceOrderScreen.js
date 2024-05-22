import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 5 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);
  return (
    <>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Box>
        <Box sx={{ my: 3 }}>
          <Typography variant="h2" sx={{ mb: 4, fontWeight: "bold" }}>
            Preview Order
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Card elevation={2} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                    Shipping
                  </Typography>
                  <Box>
                    <strong>Name:</strong>
                    {cart.shippingAddress.fullName}
                    <br />
                    <strong>Address:</strong>
                    {cart.shippingAddress.address},{cart.shippingAddress.city},
                    {cart.shippingAddress.postalCode},
                    {cart.shippingAddress.country}
                  </Box>
                </CardContent>
                <CardActions>
                  <Link to="/shipping">Edit</Link>
                </CardActions>
              </Card>
              <Card elevation={2} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                    Payment
                  </Typography>
                  <Box>
                    <strong>Method:</strong>
                    {cart.paymentMethod}
                  </Box>
                </CardContent>
                <CardActions>
                  <Link to="/payment">Edit</Link>
                </CardActions>
              </Card>
              <Card elevation={2} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                    Items
                  </Typography>
                  <Box>
                    {cart.cartItems.map((item, index) => (
                      <Grid
                        container
                        key={index}
                        sx={{
                          p: "10px",
                          // border: "1px solid #ddd",
                          mt: index === 0 ? 0 : 2,
                          alignItems: "center",
                        }}
                      >
                        <Grid
                          item
                          xs={6}
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
                          <Typography variant="h4" sx={{ mx: 2 }}>
                            {item.quantity}
                          </Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: "center" }}>
                          {`$${item.price}`}
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Link to="/cart">Edit</Link>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h4">Order Summary</Typography>
                  <Grid container spacing={1} sx={{ mt: 2 }}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5">Items</Typography>
                      <Typography variant="h5">
                        ${cart.itemsPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5">Shipping</Typography>
                      <Typography variant="h5">
                        ${cart.shippingPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5">Tax</Typography>
                      <Typography variant="h5">
                        ${cart.taxPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        Order Total
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        ${cart.totalPrice.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={cart.cartItems.length === 0}
                        onClick={placeOrderHandler}
                        fullWidth
                        sx={{ height: "35px" }}
                      >
                        Place Order
                      </Button>
                    </Grid>
                    {loading && (
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LoadingBox />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default PlaceOrderScreen;
