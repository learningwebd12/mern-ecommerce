import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/admin/add-product")}
            className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Product
          </button>

          <button
            onClick={() => navigate("/admin/add-category")}
            className="w-full text-left px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Category
          </button>

          <div>
            <button
              onClick={() => setShowOrdersDropdown(!showOrdersDropdown)}
              className="w-full text-left px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              View Orders
            </button>

            {showOrdersDropdown && (
              <div className="ml-4 mt-2 space-y-2">
                <button
                  onClick={() => navigate("/admin/all-orders")}
                  className="w-full text-left px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded"
                >
                  All Orders
                </button>
                <button
                  onClick={() => navigate("/admin/order-details")}
                  className="w-full text-left px-3 py-1 bg-purple-100 hover:bg-purple-200 rounded"
                >
                  Order Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
