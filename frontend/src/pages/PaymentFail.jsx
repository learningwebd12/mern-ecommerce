// src/pages/PaymentFail.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: log error, show toast, or send to analytics
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
      <p className="mb-4">
        Unfortunately, your eSewa payment was not completed. You can try again
        or choose a different payment method.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate("/checkout")}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Retry Payment
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFail;
