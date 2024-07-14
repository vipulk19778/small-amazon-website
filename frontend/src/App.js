import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import HomeScreen from "./screens/HomeScreen";
import { useContext, useEffect, useState } from "react";
import { Store } from "./Store";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
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
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardScreen from "./screens/DashboardScreen";
import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";

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
        <header className="flex justify-between mb-0 items-center">
          <SideNavbar categories={categories} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: userInfo?.admin ? "200px" : "150px",
            }}
          >
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
            {userInfo && userInfo.isAdmin && (
              <FormControl
                fullWidth
                size="small"
                sx={{
                  color: "white",
                  border: "1px solid white",
                }}
              >
                <InputLabel id="admin">Admin</InputLabel>
                <Select labelId="admin" label="Admin" sx={{ color: "white" }}>
                  <Link to="/admin/dashboard">
                    <MenuItem>Dashboard</MenuItem>
                  </Link>
                  <Link to="/admin/products">
                    <MenuItem>Products</MenuItem>
                  </Link>
                  <Link to="/admin/orders">
                    <MenuItem>Orders</MenuItem>
                  </Link>
                  <Link to="/admin/users">
                    <MenuItem>Users</MenuItem>
                  </Link>
                </Select>
              </FormControl>
            )}
          </Box>
        </header>
        <main style={{ background: "#aaa" }}>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/search" element={<SearchScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orderhistory"
              element={
                <ProtectedRoute>
                  <OrderHistoryScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />

            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />

            {/* Admin Routes */}

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <DashboardScreen />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <OrderListScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/product/:id"
              element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>
              }
            ></Route>

            <Route
              path="/admin/user/:id"
              element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>
              }
            ></Route>

            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <footer>Copyright</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
