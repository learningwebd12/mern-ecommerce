import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/checkout");
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-10">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2 text-red-600">Payment Failed</h1>
        <p className="text-lg mb-6 text-gray-600">
          We're sorry, but there was an issue with your payment. The transaction
          could not be completed.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Possible reasons:
          </h2>
          <ul className="text-left list-disc list-inside text-gray-600">
            <li>The payment verification failed</li>
            <li>There was an issue with your eSewa account</li>
            <li>The transaction was cancelled</li>
            <li>Network or server error occurred</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
          >
            Retry Payment
          </button>
          <button
            onClick={handleBackToCart}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
