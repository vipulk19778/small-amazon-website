import {
  Box,
  Button,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingAddressScreen = () => {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ fullName, address, city, postalCode, country })
    );
    navigate("/payment");
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);
  return (
    <>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box sx={{ maxWidth: "500px", my: 3 }}>
          <Typography variant="h2" sx={{ mb: 4, fontWeight: "bold" }}>
            Shipping Address
          </Typography>
          <form onSubmit={submitHandler} className="flex flex-col gap-6">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">Full Name</Typography>
                <TextField
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Address</Typography>
                <TextField
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">City</Typography>
                <TextField
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Postal Code</Typography>
                <TextField
                  name="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Country</Typography>
                <TextField
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ width: "150px", height: "40px" }}
                >
                  Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ShippingAddressScreen;
