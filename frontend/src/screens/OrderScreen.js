import React, { useContext, useEffect, useReducer } from "react";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getError } from "../utils";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
};

const OrderScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order
      .create({ purchase_units: [{ amount: { value: order.totalPrice } }] })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  };

  const onError = (err) => {
    toast.error(getError(err));
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!userInfo) {
      return navigate("/signin");
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(`/api/keys/paypal`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox></MessageBox>
  ) : (
    <>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>

      <Box sx={{ my: 3 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: "bold" }}>
          Order {orderId}
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
                  {order.shippingAddress.fullName}
                  <br />
                  <strong>Address:</strong>
                  {order.shippingAddress.address},{order.shippingAddress.city},
                  {order.shippingAddress.postalCode},
                  {order.shippingAddress.country}
                </Box>
                <Box>
                  {order.isDelivered ? (
                    <MessageBox>Deliverd at {order.deliverdAt}</MessageBox>
                  ) : (
                    <MessageBox>Not Delivered</MessageBox>
                  )}
                </Box>
              </CardContent>
            </Card>
            <Card elevation={2} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                  Payment
                </Typography>
                <Box>
                  <strong>Method:</strong>
                  {order.paymentMethod}
                </Box>
                <Box>
                  {order.isPaid ? (
                    <MessageBox>Paid at {order.paidAt}</MessageBox>
                  ) : (
                    <MessageBox>Not Paid</MessageBox>
                  )}
                </Box>
              </CardContent>
            </Card>
            <Card elevation={2} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                  Items
                </Typography>
                <Box>
                  {order.orderItems.map((item, index) => (
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
                      ${order.itemsPrice.toFixed(2)}
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
                      ${order.shippingPrice.toFixed(2)}
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
                      ${order.taxPrice.toFixed(2)}
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
                      ${order.totalPrice.toFixed(2)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    {!order.isPaid && (
                      <Box>
                        {isPending ? (
                          <LoadingBox></LoadingBox>
                        ) : (
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        )}
                      </Box>
                    )}
                  </Grid>

                  {loadingPay && (
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
    </>
  );
};

export default OrderScreen;
