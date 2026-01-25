import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";

const DataTable = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    language: "English",
    difficulty: "",
    subject: "",
    topic: "",
    subtopic: "",
    search: "",
    isUsed: "",
  });

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const fetchQuestions = async () => {
    // Filter out empty strings so they don't clog the URL
    const activeFilters = {};
    for (const key in filters) {
      if (filters[key]) activeFilters[key] = filters[key];
    }

    const params = new URLSearchParams({
      ...activeFilters,
      page,
      limit,
    });

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/questions?${params}`,
      );
      const data = await res.json();
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // alert("Fetching questions!");
  }, [page]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ✅ New function to trigger search when "Apply" is clicked
  const handleApply = () => {
    setPage(1); // Reset to page 1 on new filter
    fetchQuestions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/questions/${id}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        alert("Deleted Successfully");
        fetchQuestions();
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting question");
    }
  };

  // Helper for Difficulty Color
  const getDiffColor = (level) => {
    if (level === "Easy") return "bg-green-100 text-green-800";
    if (level === "Hard") return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800"; // Medium
  };

  return (
    <>
      <AdminLayout />
      <div className="flex flex-col w-full bg-indigo-100 text-black">
        <div className="w-full space-y-4 p-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-4">Question Database</h2>

          {/* --- FILTERS --- */}
          <div className="flex gap-2 mb-4 justify-between flex-wrap bg-white p-3 rounded shadow-sm">
            <select
              name="language"
              value={filters.language}
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
            </select>

            {/* NEW DIFFICULTY FILTER */}
            <select
              name="difficulty"
              value={filters.difficulty}
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            >
              <option value="">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              name="isUsed"
              value={filters.isUsed}
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            >
              <option value="">All Status</option>
              <option value="true">Used</option>
              <option value="false">Unused</option>
            </select>

            <input
              name="subject"
              placeholder="Subject"
              value={filters.subject}
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            />

            <input
              name="topic"
              placeholder="Topic"
              value={filters.topic}
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            />

            <input
              name="search"
              placeholder="Search text..."
              value={filters.search}
              className="input border rounded text-black py-1 px-2 w-64"
              onChange={handleChange}
            />

            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>

          {/* --- TABLE --- */}
          <div
            style={{ overflowX: "auto" }}
            className="bg-white rounded shadow"
          >
            <table className="w-full text-left border-collapse">
              <thead className="bg-indigo-50 text-indigo-900">
                <tr>
                  <th className="p-3 border-b">#</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Diff</th>
                  <th className="p-3 border-b">Lang</th>
                  <th className="p-3 border-b">Subject</th>
                  <th className="p-3 border-b">Topic</th>
                  <th className="p-3 border-b w-1/4">Question</th>
                  <th className="p-3 border-b">Media</th>
                  <th className="p-3 border-b">Created</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                {questions.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-5 text-center text-gray-500">
                      No questions found matching your filters.
                    </td>
                  </tr>
                )}

                {questions.map((q, index) => (
                  <tr key={q._id} className="hover:bg-gray-50 border-b">
                    <td className="p-3">{(page - 1) * limit + index + 1}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          q.isUsed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {q.isUsed ? "USED" : "UNUSED"}
                      </span>
                    </td>

                    {/* NEW DIFFICULTY COLUMN */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getDiffColor(
                          q.difficulty || "Medium",
                        )}`}
                      >
                        {q.difficulty || "Medium"}
                      </span>
                    </td>

                    <td className="p-3">{q.language}</td>
                    <td className="p-3">{q.subject}</td>
                    <td className="p-3">{q.topic}</td>

                    <td className="p-3 text-sm">
                      {q.questionText.substring(0, 80)}...
                    </td>

                    <td className="p-3">
                      {q.mediaUrl ? (
                        <a
                          href={`http://localhost:5000${q.mediaUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline text-xs"
                        >
                          View Media
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>

                    <td className="p-3 text-xs">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        onClick={() =>
                          navigate(`/admin/edit-question/${q._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={() => handleDelete(q._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGINATION --- */}
        <div className="flex justify-center items-center gap-4 py-6">
          <button
            disabled={page === 1}
            className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span className="font-medium">
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 bg-white border rounded disabled:opacity-50"
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default DataTable;
