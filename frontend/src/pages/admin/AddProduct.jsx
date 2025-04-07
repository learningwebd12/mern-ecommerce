import React, { useState, useEffect } from "react";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "", // Make sure this is initialized here
    image: null,
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const result = await response.json();
        setCategories(result); // Save categories to the state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure countInStock is included in the FormData
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("countInStock", productData.countInStock); // Append countInStock
    formData.append("image", productData.image);

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert(result.message || "Product added successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={productData.description}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded"
          required
        />
        {/* Category Dropdown */}
        <select
          name="category"
          value={productData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* countInStock Input */}
        <input
          type="number"
          name="countInStock"
          value={productData.countInStock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="w-full p-2 border rounded"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="w-full"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
