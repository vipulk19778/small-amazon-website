import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import HomeScreen from "./screens/HomeScreen";
import { useContext } from "react";
import { Store } from "./Store";

function App() {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="flex justify-between mb-4 items-center">
          <div>
            <Link to="/" className="brand">
              Amazona
            </Link>
          </div>
          <div>
            <Link to="/cart" className="mr-4">
              Cart
              {cart.cartItems.length > 0 ? (
                <span className="bg-[red] text-[white] ml-2 px-2 rounded-md">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              ) : null}
            </Link>
            <Link to="/signin">Sign In</Link>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <footer>Copyright</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
