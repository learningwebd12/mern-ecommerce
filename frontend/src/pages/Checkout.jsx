// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "Esewa",
  });

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert("Please login first.");
      return navigate("/login");
    }

    // Basic form validation
    for (const field of [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ]) {
      if (!form[field].trim()) {
        alert(
          `Please fill in your ${field
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()}`
        );
        return;
      }
    }

    setIsProcessing(true);
    const transaction_uuid = uuidv4();
    const orderData = {
      items: cart.map((item) => ({
        name: item.name,
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      shippingAddress: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
      },
      paymentMethod: form.paymentMethod,
      transaction_uuid,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();

        if (form.paymentMethod === "Esewa") {
          const product_code = "EPAYTEST";
          const signatureRes = await fetch(
            "http://localhost:5000/api/esewa/signature",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                total_amount: totalAmount,
                transaction_uuid,
                product_code,
              }),
            }
          );

          if (!signatureRes.ok) {
            throw new Error("Failed to get payment signature");
          }

          const { signature } = await signatureRes.json();

          // Show "Redirecting, Please Wait!" message here
          setIsProcessing(false);
          alert(
            "Your payment is being processed. Please do not refresh the page."
          );

          // Create and submit eSewa payment form
          const paymentForm = document.createElement("form");
          paymentForm.method = "POST";
          paymentForm.action =
            "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

          const addField = (name, value) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            paymentForm.appendChild(input);
          };

          const successUrl = "http://localhost:5173/PaymentSuccess";
          const failureUrl = "http://localhost:5173/PaymentFail";

          addField("amount", totalAmount);
          addField("tax_amount", 0);
          addField("total_amount", totalAmount);
          addField("transaction_uuid", transaction_uuid);
          addField("product_code", product_code);
          addField("product_service_charge", 0);
          addField("product_delivery_charge", 0);
          addField("success_url", successUrl);
          addField("failure_url", failureUrl);
          addField(
            "signed_field_names",
            "total_amount,transaction_uuid,product_code"
          );
          addField("signature", signature);

          document.body.appendChild(paymentForm);
          paymentForm.submit();
        } else if (form.paymentMethod === "Khalti") {
          navigate("/order-success");
        } else {
          navigate("/order-success");
        }
      } else {
        setIsProcessing(false);
        alert("Failed to place order: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Error placing order: " + err.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="mb-4">Add some items to your cart before checking out.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              className="block w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="block w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="block w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              className="block w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <input
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              className="block w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">State</label>
            <input
              name="state"
              type="text"
              value={form.state}
              onChange={handleChange}
              className="block w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">ZIP Code</label>
            <input
              name="zipCode"
              type="text"
              value={form.zipCode}
              onChange={handleChange}
              className="block w-full p-2 border rounded"
              required
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Payment Method</h3>
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="block w-full p-2 border rounded"
        >
          <option value="Esewa">Esewa</option>
          <option value="Khalti">Khalti</option>
          <option value="CashOnDelivery">Cash on Delivery</option>
        </select>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        {cart.map((item) => (
          <div key={item._id} className="flex justify-between mb-1">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 font-bold flex justify-between">
          <span>Total:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        disabled={isProcessing || !cart.length}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
