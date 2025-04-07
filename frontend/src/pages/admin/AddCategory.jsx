import React, { useState } from "react";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const result = await response.json();
      alert(result.message || "Category added successfully");
      setCategoryName(""); // Reset the form
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter category name"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
