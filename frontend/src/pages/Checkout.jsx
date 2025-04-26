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
          const { signature } = await signatureRes.json();

          // Create and submit eSewa payment form
          const form = document.createElement("form");
          form.method = "POST";
          form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

          const addField = (name, value) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
          };

          addField("amount", totalAmount);
          addField("tax_amount", 0);
          addField("total_amount", totalAmount);
          addField("transaction_uuid", transaction_uuid);
          addField("product_code", product_code);
          addField("product_service_charge", 0);
          addField("product_delivery_charge", 0);
          addField("success_url", "http://localhost:3000/success");
          addField("failure_url", "http://localhost:3000/fail");
          addField(
            "signed_field_names",
            "total_amount,transaction_uuid,product_code"
          );
          addField("signature", signature);

          document.body.appendChild(form);
          form.submit();
        } else {
          navigate("/order-success");
        }
      } else {
        alert("Failed to place order: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      {[
        "fullName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
      ].map((field) => (
        <input
          key={field}
          name={field}
          type={
            field === "email" ? "email" : field === "phone" ? "tel" : "text"
          }
          value={form[field]}
          onChange={handleChange}
          placeholder={field.replace(/([A-Z])/g, " $1")}
          className="block w-full p-2 mb-2 border"
          required
        />
      ))}

      <label className="block mb-2">Payment Method:</label>
      <select
        name="paymentMethod"
        value={form.paymentMethod}
        onChange={handleChange}
        className="block w-full p-2 border mb-4"
      >
        <option value="Esewa">Esewa</option>
        <option value="Khalti">Khalti</option>
        <option value="CashOnDelivery">Cash on Delivery</option>
      </select>

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
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={!cart.length}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
