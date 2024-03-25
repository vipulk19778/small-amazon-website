import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import HomeScreen from "./screens/HomeScreen";
import { useContext } from "react";
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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header className="flex justify-between mb-4 items-center">
          <div>
            <Link to="/" className="brand">
              Amazona
            </Link>
          </div>
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
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <footer>Copyright</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
