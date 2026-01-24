import { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import AdminLayout from "../components/layout/AdminLayout";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

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

    setIsUploading(true);

    let rows = [];
    try {
      if (file.name.endsWith(".csv")) {
        rows = await parseCSV(file);
      } else if (file.name.endsWith(".xlsx")) {
        rows = await parseExcel(file);
      } else {
        alert("Only CSV or Excel files allowed");
        setIsUploading(false);
        return;
      }

      const questions = normalizeQuestions(rows);
      console.log("Uploading:", questions);

      // --- BACKEND CONNECTION ---
      const response = await fetch(
        "http://localhost:5000/api/admin/questions/bulk",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Server message (e.g., "Uploaded 45, Skipped 5")
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset HTML input
        }
      } else {
        alert("Upload Failed: " + (result.message || result.error));
        console.error(result);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <AdminLayout />
      <div className="flex justify-center w-full pt-6 bg-indigo-100 min-h-screen">
        <div className="max-w-4xl w-full p-6 bg-white rounded shadow-md text-black flex flex-col gap-6 h-fit">
          {/* Header */}
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Bulk Upload Questions
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Import multiple questions at once using CSV or Excel.
            </p>
          </div>

          {/* Instructions Box */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
            <p className="font-bold mb-2">Instructions for file format:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Supported formats:{" "}
                <code className="bg-blue-100 px-1 rounded">.csv</code>,{" "}
                <code className="bg-blue-100 px-1 rounded">.xlsx</code>
              </li>
              <li>
                Required Headers:{" "}
                <b>
                  language, subject, topic, questionText, option1, option2,
                  option3, option4, correctOptionIndex
                </b>{" "}
                (0-3).
              </li>
              <li>
                Duplicate questions (same text & subject) will be skipped
                automatically.
              </li>
            </ul>
          </div>

          {/* Upload Area */}
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center gap-4 hover:bg-gray-100 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                cursor-pointer"
              onChange={handleFileChange}
            />

            {file && (
              <div className="mt-2 flex items-center gap-3 bg-white border px-4 py-2 rounded shadow-sm">
                <div className="text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="ml-4 text-red-500 hover:text-red-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`px-8 py-2 rounded font-medium text-white transition-all
                ${
                  !file || isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                }`}
            >
              {isUploading ? "Processing..." : "Upload File"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
