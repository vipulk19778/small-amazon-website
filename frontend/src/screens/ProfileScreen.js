import React, { useContext, useReducer, useState } from "react";
import { Store } from "../Store";
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "/api/users/profile",
        { name, email, password },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User updated successfully");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err));
    }
  };
  return (
    <>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ maxWidth: "600px", width: "100%" }}>
          <Typography variant="h1" my={3}>
            User Profile
          </Typography>
          <form onSubmit={submitHandler}>
            <FormGroup sx={{ mb: 3 }}>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                ></TextField>
              </FormControl>
            </FormGroup>
            <FormGroup sx={{ mb: 3 }}>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <TextField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                ></TextField>
              </FormControl>
            </FormGroup>
            <FormGroup sx={{ mb: 3 }}>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <TextField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                ></TextField>
              </FormControl>
            </FormGroup>
            <FormGroup sx={{ mb: 3 }}>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <TextField
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                ></TextField>
              </FormControl>
            </FormGroup>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ProfileScreen;
