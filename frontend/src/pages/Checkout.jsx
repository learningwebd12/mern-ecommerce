import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ensure this is correctly imported

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    city: "",
    country: "",
    postalCode: "",
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
    const user = isAuthenticated();
    if (!user) {
      alert("Please login first.");
      return navigate("/login");
    }

    const orderData = {
      userId: user._id,
      items: cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price, // ✅ Important!
      })),
      totalAmount,
      shippingAddress: {
        address: form.address,
        city: form.city,
        country: form.country,
        postalCode: form.postalCode,
      },
      status: "Pending",
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
        alert("Order placed! Redirecting to Esewa...");
        if (form.paymentMethod === "Esewa") {
          window.location.href = `https://esewa.com.np?amt=${totalAmount}&pid=${data._id}&scd=EPAYTEST&su=http://localhost:3000/success&fu=http://localhost:3000/fail`;
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
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="block w-full p-2 mb-2 border"
      />
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        className="block w-full p-2 mb-2 border"
      />
      <input
        name="country"
        value={form.country}
        onChange={handleChange}
        placeholder="Country"
        className="block w-full p-2 mb-2 border"
      />
      <input
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        placeholder="Postal Code"
        className="block w-full p-2 mb-4 border"
      />

      <label className="block mb-2">Payment Method:</label>
      <select
        name="paymentMethod"
        value={form.paymentMethod}
        onChange={handleChange}
        className="block w-full p-2 border mb-4"
      >
        <option value="Esewa">Esewa</option>
        <option value="CashOnDelivery">Cash on Delivery</option>
      </select>

      <button
        onClick={handlePlaceOrder}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Place Order - ₹{totalAmount.toFixed(2)}
      </button>
    </div>
  );
};

export default Checkout;
