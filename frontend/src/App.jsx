import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import AddProduct from "./pages/admin/AddProduct";
import AddCategory from "./pages/admin/AddCategory";
import AllProduct from "./components/AllProduct";
import Dashboard from "./pages/Dashboard";
import Product from "./components/SingleProduct";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";

const Layout = ({ children }) => {
  const location = useLocation();

  // Check if the current path starts with /admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Conditionally render Navbar and Footer based on the route */}
      {!isAdminRoute && <Navbar />} {/* Hide Navbar on admin routes */}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap the AuthProvider around Router to access auth context */}
      <Router>
        <CartProvider>
          {" "}
          {/* Wrap CartProvider around the layout */}
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/product" element={<AllProduct />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/my-orders" element={<MyOrders />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/add-category" element={<AddCategory />} />
            </Routes>
          </Layout>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
