import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const PaymentSuccess = () => {
  const location = useLocation();
  const { clearCart } = useCart();

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const encodedData = queryParams.get("data");

        if (!encodedData) {
          setStatus("No payment data received.");
          return;
        }

        const jsonData = JSON.parse(atob(encodedData));
        setData(jsonData);

        if (jsonData.status === "COMPLETE") {
          setStatus("✅ Payment successful!");

          // 🔄 Call backend to verify payment and update order
          const response = await fetch("/api/payment/verify-esewa", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: jsonData.total_amount,
              refId: jsonData.transaction_uuid,
            }),
          });

          const resData = await response.json();

          if (response.ok) {
            clearCart(); // ✅ Clear cart if payment verified
          } else {
            setStatus(`⚠️ Verification failed: ${resData.message}`);
          }
        } else {
          setStatus("❌ Payment failed or cancelled.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("⚠️ Error verifying payment.");
      }
    };

    verifyPayment();
  }, [location.search, clearCart]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>eSewa Payment Status</h1>
      <p>{status}</p>

      {data && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Transaction Code:</strong> {data.transaction_code}
          </p>
          <p>
            <strong>Amount:</strong> ₹{data.total_amount}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Transaction UUID:</strong> {data.transaction_uuid}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
