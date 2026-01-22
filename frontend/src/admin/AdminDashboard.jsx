import React from "react";
import AdminPanel from "./components/AdminPanel";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <AdminPanel />

      {/* Page content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
