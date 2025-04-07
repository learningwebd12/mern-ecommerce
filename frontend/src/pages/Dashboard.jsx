import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Add Product</h2>
          <button
            onClick={() => navigate("/admin/add-product")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add product
          </button>
        </div>

        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Add Category</h2>
          <button
            onClick={() => navigate("/admin/add-category")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            add Category
          </button>
        </div>

        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">View Orders</h2>
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
