import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import AddProduct from "./pages/admin/AddProduct";
import AddCategory from "./pages/admin/AddCategory";
import AllProduct from "./components/AllProduct";
import Dashboard from "./pages/Dashboard";
import Product from "./components/SingleProduct";

const Layout = ({ children }) => {
  const location = useLocation();

  // Check if current path starts with /admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />} {/* Hide Navbar on admin routes */}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<AllProduct />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          {/* Fix: Use 'element' instead of 'component' */}
          <Route path="/product/:id" element={<Product />} />
          <Route path="/admin/add-category" element={<AddCategory />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
