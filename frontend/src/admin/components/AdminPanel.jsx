import React from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <aside className="w-64 bg-indigo-400 shrink-0">
      <ul className="flex flex-col">
        <li className="p-4">
          <Link
            to="/admin/upload-question"
            className="bg-gray-500 flex justify-center py-2 text-white rounded"
          >
            Upload Question
          </Link>
        </li>
        <li className="p-4">
          <Link
            to="/admin/upload-file"
            className="bg-gray-500 flex justify-center py-2 text-white rounded"
          >
            Upload File
          </Link>
        </li>
        <li className="p-4">
          <Link
            to="/admin/data-table"
            className="bg-gray-500 flex justify-center py-2 text-white rounded"
          >
            Data Table
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminPanel;
