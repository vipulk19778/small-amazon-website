import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProductScreen from "./screens/ProductScreen";
import HomeScreen from "./screens/HomeScreen";

function App() {
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
