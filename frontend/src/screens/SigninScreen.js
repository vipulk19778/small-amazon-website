import {
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

const SigninScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container sx={{ maxWidth: "600px" }}>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <Typography variant="h1" sx={{ my: 3 }}>
        Sign In
      </Typography>

      <form onSubmit={submitHandler}>
        <FormGroup sx={{ mb: 3 }}>
          <FormLabel sx={{ fontSize: "20px", fontWeight: "bold" }}>
            Email
          </FormLabel>
          <TextField
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
        </FormGroup>
        <FormGroup sx={{ mb: 3 }}>
          <FormLabel sx={{ fontSize: "20px", fontWeight: "bold" }}>
            Password
          </FormLabel>
          <TextField
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></TextField>
        </FormGroup>
        <Box sx={{ mb: 3 }}>
          <Button type="submit" variant="contained">
            Sign In
          </Button>
        </Box>
        <Box>
          New Customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </Box>
      </form>
    </Container>
  );
};

export default SigninScreen;
