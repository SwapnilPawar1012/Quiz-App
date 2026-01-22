import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { useNavigate } from "react-router-dom";

const DataTable = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    language: "English",
    subject: "",
    topic: "",
    subtopic: "",
    search: "",
  });

  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const fetchQuestions = async () => {
    const params = new URLSearchParams({
      ...filters,
      page,
      limit,
    });

    const res = await fetch(
      `http://localhost:5000/api/admin/questions?${params}`,
    );
    const data = await res.json();

    setQuestions(data.questions || []);
    setTotal(data.total || 0);
  };

  useEffect(() => {
    alert("Fetching questions!");
    // fetchQuestions();
  }, [page]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    await fetch(`http://localhost:5000/api/admin/questions/${id}`, {
      method: "DELETE",
    });

    fetchQuestions();
  };

  return (
    <>
      <AdminLayout />
      <div className="flex flex-col w-full bg-indigo-100 text-black">
        <div className="w-full space-y-4 p-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-4">Question Database</h2>

          {/* Filters */}
          <div className="flex gap-2 mb-4 justify-evenly">
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

            <input
              name="subject"
              placeholder="Subject"
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            />

            <input
              name="topic"
              placeholder="Topic"
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            />

            <input
              name="subtopic"
              placeholder="Subtopic"
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            />

            <input
              name="search"
              placeholder="Search question"
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            />

            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded"
              onClick={() => {
                setPage(1);
                fetchQuestions();
              }}
            >
              Apply
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table border="1" cellPadding="8" width="100%">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Language</th>
                  <th>Subject</th>
                  <th>Topic</th>
                  <th>Subtopic</th>
                  <th>Question</th>
                  <th>Media</th> {/* Added Media Column */}
                  <th>Options</th>
                  <th>Correct</th>
                  <th>Solution</th>
                  <th>Explanation</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {questions.length === 0 && (
                  <tr>
                    <td colSpan="12" align="center">
                      No questions found
                    </td>
                  </tr>
                )}

                {questions.map((q, index) => (
                  <tr key={q._id}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{q.language}</td>
                    <td>{q.subject || "unknown"}</td>
                    <td>{q.topic || ""}</td>
                    <td>{q.subtopic || ""}</td>

                    <td style={{ maxWidth: 300 }}>{q.questionText}</td>

                    {/* Media Cell */}
                    <td>
                      {q.media ? (
                        q.media.type === "video" ? (
                          <video
                            src={`http://localhost:5000${q.media.url}`}
                            controls
                            style={{ maxWidth: "50px" }}
                          />
                        ) : (
                          <img
                            src={`http://localhost:5000${q.media.url}`}
                            alt="question media"
                            style={{ maxWidth: "50px" }}
                          />
                        )
                      ) : (
                        <span>-</span>
                      )}
                    </td>

                    <td>
                      <ol type="A">
                        {q.options.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ol>
                    </td>

                    <td>Option {q.correctOptionIndex + 1}</td>
                    <td>{q.solutionText}</td>
                    <td style={{ maxWidth: 300 }}>{q.solutionExplanation}</td>
                    <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-question/${q._id}`)
                        }
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(q._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-8 mt-6">
          <button
            disabled={page === 1}
            className="hover:text-blue-800"
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            className="hover:text-blue-800"
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
