import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [removeMedia, setRemoveMedia] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // ---------- Fetch question ----------
  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/questions/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, [id]);

  // ---------- Warn on refresh / close ----------
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // ---------- Cleanup preview ----------
  useEffect(() => {
    return () => {
      if (mediaFile) {
        URL.revokeObjectURL(mediaFile);
      }
    };
  }, [mediaFile]);

  if (!formData) return <p>Loading...</p>;

  // ---------- Safe navigation ----------
  const safeNavigate = (path) => {
    if (isDirty) {
      const ok = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?",
      );
      if (!ok) return;
    }
    navigate(path);
  };

  // ---------- Handlers ----------
  const handleChange = (e) => {
    setIsDirty(true);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    setIsDirty(true);

    const options = [...formData.options];
    options[index] = value;

    setFormData((prev) => ({
      ...prev,
      options,
      solutionText:
        index === prev.correctOptionIndex ? value : prev.solutionText,
    }));
  };

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("data", JSON.stringify(formData));
    form.append("removeMedia", removeMedia ? "true" : "false");

    if (mediaFile) {
      form.append("media", mediaFile);
    }

    await fetch(`http://localhost:5000/api/admin/questions/${id}`, {
      method: "PUT",
      body: form,
    });

    alert("Question updated successfully");
    setIsDirty(false);
    safeNavigate("/admin/data-table");
  };

  return (
    <>
      <AdminLayout />

      <div className="flex justify-center w-full pt-6 bg-indigo-100">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl space-y-4 p-5 text-black flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold">Edit Question</h2>

          {/* Language */}
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
          </select>

          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
          />

          <input
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="Topic"
          />

          <input
            name="subtopic"
            value={formData.subtopic}
            onChange={handleChange}
            placeholder="Subtopic"
          />

          {/* Question */}
          <textarea
            name="questionText"
            value={formData.questionText}
            onChange={handleChange}
            required
          />

          {/* Existing Media */}
          {formData.media && !removeMedia && (
            <div>
              <p>Current Media:</p>

              {formData.media.type === "video" ? (
                <video
                  src={`http://localhost:5000${formData.media.url}`}
                  controls
                  style={{ maxWidth: "200px" }}
                />
              ) : (
                <img
                  src={`http://localhost:5000${formData.media.url}`}
                  style={{ maxWidth: "200px" }}
                />
              )}

              <button
                type="button"
                onClick={() => {
                  setIsDirty(true);
                  setRemoveMedia(true);
                }}
                style={{ color: "red" }}
              >
                Remove Media
              </button>
            </div>
          )}

          {/* Replace Media */}
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              if (file.size > 10 * 1024 * 1024) {
                alert("File must be under 10MB");
                return;
              }

              setIsDirty(true);
              setMediaFile(file);
              setRemoveMedia(false);
            }}
          />

          {/* Options */}
          {formData.options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              required
              placeholder={`Option ${i + 1}`}
            />
          ))}

          {/* Correct Option */}
          <select
            value={formData.correctOptionIndex}
            onChange={(e) => {
              const index = Number(e.target.value);
              setIsDirty(true);
              setFormData((prev) => ({
                ...prev,
                correctOptionIndex: index,
                solutionText: prev.options[index] || "",
              }));
            }}
          >
            <option value={0}>Correct Option 1</option>
            <option value={1}>Correct Option 2</option>
            <option value={2}>Correct Option 3</option>
            <option value={3}>Correct Option 4</option>
          </select>

          {/* Solution (read-only) */}
          <input value={formData.solutionText} readOnly />

          {/* Explanation */}
          <textarea
            name="solutionExplanation"
            value={formData.solutionExplanation}
            onChange={handleChange}
          />

          <div className="flex gap-4">
            <button
              disabled={!isDirty}
              className="bg-indigo-600 text-white px-6 py-2 rounded"
            >
              Update Question
            </button>

            <button
              type="button"
              onClick={() => safeNavigate("/admin/data-table")}
              className="bg-gray-500 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditQuestion;