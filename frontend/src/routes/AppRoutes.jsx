import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import AdminDashboard from "../admin/pages/AdminDashboard";
import QuestionUpload from "../admin/pages/QuestionUpload";
import FileUpload from "../admin/pages/FileUpload";
import DataTable from "../admin/pages/DataTable";
import EditQuestion from "../admin/components/common/EditQuestion";
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
      <Route path="/admin/edit-question/:id" element={<EditQuestion />} />

      {/* Quiz and Video Routes */}
      <Route path="/videos" element={<Videos />} />
      <Route path="/create" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
