import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import AdminDashboard from "../Admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="Admin" element={<AdminDashboard />} />
      {/* <Route path="/video" element={<Home />} /> */}
      {/* <Route path="/" element={<Home />} /> */}
    </Routes>
  );
};

export default AppRoutes;
