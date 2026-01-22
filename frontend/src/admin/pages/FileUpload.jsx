import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import AdminLayout from "../components/layout/AdminLayout";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const parseCSV = (file) => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
      });
    });
  };

  const parseExcel = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  };

  const normalizeQuestions = (rows) => {
    return rows.map((row) => ({
      language: row.language || "English",
      subject: row.subject || "Unknown",
      topic: row.topic || "Unknown",
      subtopic: row.subtopic || "Unknown",
      questionText: row.questionText,
      options: [row.option1, row.option2, row.option3, row.option4],
      correctOptionIndex: Number(row.correctOptionIndex),
      solutionText: row.solutionText,
      solutionExplanation: row.solutionExplanation || "No Explanation!",
    }));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    let rows = [];

    if (file.name.endsWith(".csv")) {
      rows = await parseCSV(file);
    } else if (file.name.endsWith(".xlsx")) {
      rows = await parseExcel(file);
    } else {
      alert("Only CSV or Excel files allowed");
      return;
    }

    const questions = normalizeQuestions(rows);

    console.log("Uploading:", questions);

    // await fetch("http://localhost:5000/api/admin/questions/bulk", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ questions }),
    // });

    alert(`Uploaded ${questions.length} questions successfully`);
  };

  return (
    <>
      <AdminLayout />
      <div className="flex justify-center w-full pt-6 bg-indigo-100">
        <div className="max-w-4xl space-y-4 p-5  text-black flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Upload File (CSV or Excel)</h2>

          <input
            type="file"
            accept=".csv,.xlsx"
            className="border px-2 py-1"
            onChange={handleFileChange}
          />

          <button
            onClick={handleUpload}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Upload File
          </button>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
