import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Please log in to view your cart.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600 text-xl">
        Your cart is empty.{" "}
        <Link to="/product" className="text-blue-500 underline">
          Go shopping!
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cart.map((product) => (
        <div
          key={product._id}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-sm text-gray-500">Price: ₹{product.price}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => decreaseQty(product._id)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span>{product.quantity}</span>
            <button
              onClick={() => increaseQty(product._id, product.countInStock)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeFromCart(product._id)}
            className="text-red-500 underline"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="text-right mt-6 text-xl font-semibold">
        Total: ₹{totalPrice.toFixed(2)}
      </div>

      <div className="text-right mt-4">
        <button
          onClick={() => navigate("/checkout")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
