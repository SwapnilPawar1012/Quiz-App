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
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        // Ensure options array exists
        if (!data.options) data.options = ["", "", "", ""];
        setFormData(data);
      })
      .catch((err) => {
        alert("Error fetching question");
        navigate("/admin/data-table");
      });
  }, [id, navigate]);

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
      if (mediaFile) URL.revokeObjectURL(mediaFile);
    };
  }, [mediaFile]);

  if (!formData) return <div className="p-10 text-center">Loading Data...</div>;

  // ---------- Safe navigation ----------
  const safeNavigate = (path) => {
    if (isDirty) {
      const ok = window.confirm("Unsaved changes. Leave anyway?");
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

    // Clean data before sending
    const dataToSend = { ...formData };
    // We don't need to send the existing mediaUrl string back to backend
    // The backend only cares if there is a NEW file or removeMedia flag
    delete dataToSend.mediaUrl;
    delete dataToSend.mediaType;

    form.append("data", JSON.stringify(dataToSend));
    form.append("removeMedia", removeMedia ? "true" : "false");

    if (mediaFile) {
      form.append("media", mediaFile);
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/questions/${id}`,
        {
          method: "PUT",
          body: form,
        },
      );

      if (res.ok) {
        alert("Question updated successfully");
        setIsDirty(false); // Reset dirty flag so navigation doesn't warn
        navigate("/admin/data-table");
      } else {
        const err = await res.json();
        alert("Update failed: " + err.error);
      }
    } catch (error) {
      console.error(error);
      alert("Network Error");
    }
  };

  return (
    <>
      <AdminLayout />
      <div className="flex justify-center w-full pt-6 bg-indigo-100 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl w-full space-y-4 p-6 bg-white rounded shadow-md text-black flex flex-col gap-4 mb-10"
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-2xl font-bold">Edit Question</h2>
            <button
              type="button"
              onClick={() => safeNavigate("/admin/data-table")}
              className="text-gray-500 hover:text-red-500"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Language */}
            <select
              name="language"
              className="input border rounded p-2"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
            </select>

            <select
              name="isUsed"
              className="input border rounded p-2"
              value={formData.isUsed ? "true" : "false"}
              onChange={(e) => {
                setIsDirty(true);
                setFormData({ ...formData, isUsed: e.target.value === "true" });
              }}
            >
              <option value="false">Status: Unused</option>
              <option value="true">Status: Used</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              name="subject"
              className="input border rounded p-2"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
            />
            <input
              name="topic"
              className="input border rounded p-2"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Topic"
            />
            <input
              name="subtopic"
              className="input border rounded p-2"
              value={formData.subtopic}
              onChange={handleChange}
              placeholder="Subtopic"
            />
          </div>

          {/* Question */}
          <textarea
            name="questionText"
            className="input border rounded p-2 h-24"
            value={formData.questionText}
            onChange={handleChange}
            required
            placeholder="Question Text"
          />

          {/* --- MEDIA SECTION --- */}
          <div className="p-4 border rounded bg-gray-50">
            <p className="font-semibold mb-2">Media Attachment</p>

            {/* 1. Show Existing Media (if exists and not flagged for removal) */}
            {formData.mediaUrl && !removeMedia && !mediaFile && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Current File:</p>
                {formData.mediaType &&
                formData.mediaType.startsWith("video") ? (
                  <video
                    src={`http://localhost:5000${formData.mediaUrl}`}
                    controls
                    className="max-h-48 border"
                  />
                ) : (
                  <img
                    src={`http://localhost:5000${formData.mediaUrl}`}
                    alt="current"
                    className="max-h-48 border"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsDirty(true);
                    setRemoveMedia(true);
                  }}
                  className="mt-2 text-red-600 text-sm hover:underline"
                >
                  Remove current media
                </button>
              </div>
            )}

            {/* 2. Show New File Preview (if selected) */}
            {mediaFile && (
              <div className="mb-4">
                <p className="text-sm text-green-600 mb-1">
                  New File Selected:
                </p>
                {mediaFile.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(mediaFile)}
                    alt="preview"
                    className="max-h-48 border"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(mediaFile)}
                    controls
                    className="max-h-48 border"
                  />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaFile(null);
                    setRemoveMedia(false);
                  }}
                  className="mt-2 text-blue-600 text-sm hover:underline"
                >
                  Undo selection
                </button>
              </div>
            )}

            {/* 3. Upload Input */}
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
                setRemoveMedia(false); // If we pick a new file, we aren't just "removing" the old one, we are replacing it
              }}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100
              "
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {formData.options.map((opt, i) => (
              <input
                key={i}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                required
                placeholder={`Option ${i + 1}`}
                className="input border rounded p-2"
              />
            ))}
          </div>

          {/* Correct Option */}
          <div className="flex gap-4 items-center">
            <select
              value={formData.correctOptionIndex}
              className="input border rounded p-2 w-1/3"
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
              <option value={0}>Correct: Option 1</option>
              <option value={1}>Correct: Option 2</option>
              <option value={2}>Correct: Option 3</option>
              <option value={3}>Correct: Option 4</option>
            </select>

            <input
              value={formData.solutionText}
              readOnly
              className="input border rounded p-2 flex-1 bg-gray-100"
              placeholder="Correct Answer Text"
            />
          </div>

          {/* Explanation */}
          <textarea
            name="solutionExplanation"
            value={formData.solutionExplanation}
            onChange={handleChange}
            placeholder="Solution Explanation"
            className="input border rounded p-2 h-20"
          />

          <div className="flex gap-4 pt-4 border-t">
            <button
              disabled={!isDirty}
              className={`px-6 py-2 rounded text-white ${isDirty ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => safeNavigate("/admin/data-table")}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
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
