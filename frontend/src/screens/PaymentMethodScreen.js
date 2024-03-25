import {
  Box,
  Button,
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
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentMethodScreen = () => {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "PayPal"
  );

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: paymentMethodName,
    });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);
  return (
    <>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box sx={{ maxWidth: "500px", my: 3 }}>
          <Typography variant="h2" sx={{ mb: 4, fontWeight: "bold" }}>
            Payment Method
          </Typography>
          <form onSubmit={submitHandler} className="flex flex-col gap-6">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup row name="payment">
                    <FormControlLabel
                      value="PayPal"
                      control={<Radio />}
                      label="PayPal"
                      checked={paymentMethodName === "PayPal"}
                      onChange={(e) => setPaymentMethodName(e.target.value)}
                    />
                    <FormControlLabel
                      value="Stripe"
                      control={<Radio />}
                      label="Stripe"
                      checked={paymentMethodName === "Stripe"}
                      onChange={(e) => setPaymentMethodName(e.target.value)}
                    />
                  </RadioGroup>
                </FormControl>
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

export default PaymentMethodScreen;
