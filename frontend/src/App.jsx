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
import Product from "./components/SingleProduct";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import AllOrders from "./pages/admin/AllOrders";
import Dashboard from "./pages/Dashboard"; 
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import AdminLayout from "./components/AdminLayout"; 

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <CartProvider>
          <PublicLayout>
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

              {/* Admin Layout Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="add-category" element={<AddCategory />} />
                <Route path="all-orders" element={<AllOrders />} />

                {/* Add more admin pages as needed */}
              </Route>
            </Routes>
          </PublicLayout>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
