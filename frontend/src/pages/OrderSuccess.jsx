// src/pages/OrderSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Order Placed Successfully!
      </h2>
      <p className="mb-6 text-lg text-gray-700">
        Thank you for your purchase. Your order has been placed and is being
        processed.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
