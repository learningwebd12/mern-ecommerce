import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content for each page */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
