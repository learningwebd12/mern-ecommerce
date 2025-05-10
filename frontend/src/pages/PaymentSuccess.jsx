import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const status = query.get("status");
    const transaction_uuid = query.get("transaction_uuid");
    const total_amount = query.get("total_amount");
    const product_code = query.get("product_code");
    const transaction_code = query.get("transaction_code");

    if (
      status === "COMPLETE" &&
      transaction_uuid &&
      product_code &&
      total_amount
    ) {
      verifyEsewaPayment({
        status,
        transaction_uuid,
        total_amount,
        product_code,
        transaction_code,
      });
    }
  }, [location]);

  const verifyEsewaPayment = async (data) => {
    try {
      const res = await axios.post("/api/orders/verify-esewa", data);
      console.log("Payment Verified:", res.data);

      setPaymentStatus("success");
      setTotalAmount(res.data.order.totalAmount); // Display the price
    } catch (err) {
      console.error("Verification Failed:", err.response?.data || err.message);
      setPaymentStatus("failed");
      setErrorMessage("Payment verification failed. Please try again.");
    }
  };

  return (
    <div className="payment-success">
      <h1>
        {paymentStatus === "success"
          ? "Payment Successful!"
          : "Verifying Payment..."}
      </h1>
      {paymentStatus === "success" && (
        <>
          <p>
            Your payment of NPR {totalAmount} has been successfully verified.
          </p>
          <p>Thank you for your purchase!</p>
        </>
      )}
      {paymentStatus === "failed" && <p>{errorMessage}</p>}
    </div>
  );
};

export default PaymentSuccess;
