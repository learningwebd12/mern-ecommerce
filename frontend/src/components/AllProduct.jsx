import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "./Banner";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const result = await response.json();
        setProducts(result.products); // assuming products are in a 'products' key in the response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (products.length === 0) {
    return <div>No products available.</div>;
  }

  return (
    <div className="p-6">
      <Banner
        title="Product"
        subtitle="At Fashion Brand Name, we believe that fashion is more than just clothing it's a powerful form of self-expression. "
      />
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="w-full h-64 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="mb-2">{product.description}</p>
            <span className="text-lg font-semibold">₹{product.price}</span>
            <div className="mt-4">
              <Link
                to={`/product/${product._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
