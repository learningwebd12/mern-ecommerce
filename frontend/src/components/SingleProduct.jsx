import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams

const Product = () => {
  const { id } = useParams(); // Get product id from route params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        const result = await response.json();
        console.log("API response:", result);

        // Handle different possible response structures
        if (result.product) {
          setProduct(result.product);
        } else if (result && typeof result === "object" && result._id) {
          // If the API returns the product directly without nesting it
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

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
    </div>
  );
};

export default Product;
