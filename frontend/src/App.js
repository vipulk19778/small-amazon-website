import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import HomeScreen from "./screens/HomeScreen";
import { useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import {
  Divider,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SideNavbar from "./components/SideNavbar";
import { getError } from "./utils";
import axios from "axios";
import SearchScreen from "./screens/SearchScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  const [categories, setCategories] = useState([]);

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
  }, []);

  return (
    <BrowserRouter>
      <div className="grid-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header className="flex justify-between mb-4 items-center">
          <SideNavbar categories={categories} />
          <div className="flex items-center w-[150px]">
            <Link to="/cart" className="mr-4">
              Cart
              {cart.cartItems.length > 0 ? (
                <span className="bg-[red] text-[white] ml-2 px-2 rounded-md">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              ) : null}
            </Link>
            {userInfo ? (
              <FormControl
                fullWidth
                size="small"
                sx={{
                  color: "white",
                  border: "1px solid white",
                }}
              >
                <InputLabel id="profile">{userInfo.name}</InputLabel>
                <Select
                  labelId="profile"
                  label={userInfo.name}
                  sx={{ color: "white" }}
                >
                  <Link to="/profile">
                    <MenuItem>User Profile</MenuItem>
                  </Link>
                  <Link to="/orderhistory">
                    <MenuItem>Order History</MenuItem>
                  </Link>
                  <Divider />
                  <Link to="#signout" onClick={signoutHandler}>
                    <MenuItem>Sign Out</MenuItem>
                  </Link>
                </Select>
              </FormControl>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/orderhistory" element={<OrderHistoryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />

            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <footer>Copyright</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
