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

const SignupScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const { data } = await axios.post("/api/users/signup", {
        name,
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
        <title>Sign Up</title>
      </Helmet>
      <Typography variant="h1" sx={{ my: 3 }}>
        Sign Up
      </Typography>

      <form onSubmit={submitHandler}>
        <FormGroup sx={{ mb: 3 }}>
          <FormLabel sx={{ fontSize: "20px", fontWeight: "bold" }}>
            Name
          </FormLabel>
          <TextField
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></TextField>
        </FormGroup>
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
        <FormGroup sx={{ mb: 3 }}>
          <FormLabel sx={{ fontSize: "20px", fontWeight: "bold" }}>
            Confirm Password
          </FormLabel>
          <TextField
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></TextField>
        </FormGroup>
        <Box sx={{ mb: 3 }}>
          <Button type="submit" variant="contained">
            Sign Up
          </Button>
        </Box>
        <Box>
          Already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </Box>
      </form>
    </Container>
  );
};

export default SignupScreen;
