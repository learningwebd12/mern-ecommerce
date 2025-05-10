// src/pages/Success.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const encodedData = searchParams.get("data");

      if (!encodedData) {
        return navigate("/fail");
      }

      try {
        const decoded = JSON.parse(atob(encodedData)); // Base64 decode and parse
        console.log("Decoded eSewa data:", decoded);

        const transaction_uuid = decoded.transaction_uuid;

        const res = await fetch("http://localhost:5000/api/esewa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction_uuid }),
        });

        const result = await res.json();

        if (res.ok && result.verified) {
          // Redirect to your order success page
          navigate("/", { replace: true });
        } else {
          navigate("/fail", { replace: true });
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        navigate("/fail", { replace: true });
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Verifying Payment...</h2>
      <p>Please wait while we confirm your transaction.</p>
    </div>
  );
};

export default Success;
