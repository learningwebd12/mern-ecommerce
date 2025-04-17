import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // Use the CartContext
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const { cart, clearCart } = useCart(); // Access cart and clearCart
  const { user, isAuthenticated } = useAuth();
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
    if (!isAuthenticated) {
      alert("Please login first.");
      return navigate("/login");
    }

    const orderData = {
      items: cart.map((item) => ({
        name: item.name,
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      shippingAddress: {
        address: form.address,
        city: form.city,
        country: form.country,
        postalCode: form.postalCode,
      },
      paymentMethod: form.paymentMethod,
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
        clearCart(); // Now this should work
        alert("Order placed successfully!");

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
        required
      />
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        className="block w-full p-2 mb-2 border"
        required
      />
      <input
        name="country"
        value={form.country}
        onChange={handleChange}
        placeholder="Country"
        className="block w-full p-2 mb-2 border"
        required
      />
      <input
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        placeholder="Postal Code"
        className="block w-full p-2 mb-4 border"
        required
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
