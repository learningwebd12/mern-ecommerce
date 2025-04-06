import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center p-4 px-15">
        <div className="logo">
          <p>Cloth</p>
        </div>
        <div className="flex gap-5 font-poppins items-center">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/product">Product</Link>
          <Link to="/signin">Sign in</Link>
          <Link to="signup" className="bg-black p-2 px-5 text-white rounded-md">
            Sign up
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
