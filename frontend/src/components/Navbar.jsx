import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // adjust path if needed
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Navbar = () => {
  const { cart } = useCart(); // Access cart items from context
  const { user, logout } = useContext(AuthContext); // Access user state from AuthContext

  return (
    <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto ">
      <div className="logo">
        <p>Cloth</p>
      </div>
      <div className="flex gap-5 font-poppins items-center ">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/product">Product</Link>

        {/* Only show the Cart if the user is logged in */}
        {user && user.token && (
          <Link to="/cart" className="relative">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        )}

        {/* Show Login and Signup if user is not logged in */}
        {!user ? (
          <>
            <Link to="/login">Log in</Link>
            <Link
              to="/signup"
              className="bg-black p-2 px-5 text-white rounded-md"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            <span>Welcome, {user.name}</span>
            <button onClick={logout} className="text-red-500">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
