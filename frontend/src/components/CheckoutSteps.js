import { Grid } from "@mui/material";
import React from "react";

const CheckoutSteps = (props) => {
  return (
    <Grid container className="checkout-steps">
      <Grid item xs={3} className={props.step1 ? "active" : ""}>
        Sign-In
      </Grid>
      <Grid item xs={3} className={props.step2 ? "active" : ""}>
        Shipping
      </Grid>
      <Grid item xs={3} className={props.step3 ? "active" : ""}>
        Payment
      </Grid>
      <Grid item xs={3} className={props.step4 ? "active" : ""}>
        Place Order
      </Grid>
    </Grid>
  );
};

export default CheckoutSteps;
