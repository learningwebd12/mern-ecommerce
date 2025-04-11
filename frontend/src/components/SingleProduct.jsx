import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        const result = await response.json();
        console.log("API response:", result);

        if (result.product) {
          setProduct(result.product);
        } else if (result && typeof result === "object" && result._id) {
          setProduct(result);
        } else {
          console.error("Unexpected API response structure:", result);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.countInStock) {
      addToCart(product, quantity);
      alert(`${product.name} added to cart with quantity ${quantity}!`);
    } else {
      alert("Quantity exceeds stock availability!");
    }
  };

  const increaseQty = () => {
    if (quantity < product.countInStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (!product) return <div className="text-center">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>
      <div className="mb-4">
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="mb-4">
        <span className="text-xl font-semibold">Price: ₹{product.price}</span>
      </div>
      <div className="mb-4">
        <p>{product.description}</p>
      </div>
      <div className="mb-4">
        <span className="font-semibold">
          Category: {product.category?.name}
        </span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">In Stock: {product.countInStock}</span>
      </div>

      {isAuthenticated() ? (
        <>
          <div className="flex items-center gap-4 my-4">
            <button
              onClick={decreaseQty}
              className="px-3 py-1 bg-gray-300 rounded text-xl font-bold"
            >
              −
            </button>
            <span className="text-xl">{quantity}</span>
            <button
              onClick={increaseQty}
              className="px-3 py-1 bg-gray-300 rounded text-xl font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </>
      ) : (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="mb-3">Please log in to add this item to your cart</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 inline-block"
          >
            Log In
          </Link>
        </div>
      )}
    </div>
  );
};

export default Product;
