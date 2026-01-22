import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import AdminDashboard from "../admin/AdminDashboard";
import QuestionUpload from "../admin/components/QuestionUpload";
import FileUpload from "../admin/components/FileUpload";
import DataTable from "../admin/components/DataTable";
import Videos from "../pages/Videos";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/upload-question" element={<QuestionUpload />} />
      <Route path="/admin/upload-file" element={<FileUpload />} />
      <Route path="/admin/data-table" element={<DataTable />} />

      {/* Quiz and Video Routes */}
      <Route path="/videos" element={<Videos />} />
      <Route path="/create" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
