import { useState, useEffect, useRef } from "react";
import AdminLayout from "../components/layout/AdminLayout";

// Defaults set to empty strings for cleaner UI
const INITIAL_FORM = {
  language: "English",
  subject: "",
  topic: "",
  subtopic: "",
  questionText: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  solutionText: "",
  solutionExplanation: "",
};

const QuestionUpload = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [mediaFile, setMediaFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
      solutionText:
        index === prev.correctOptionIndex ? value : prev.solutionText,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logic: Fill defaults if empty
    const dataToSend = { ...formData };
    if (!dataToSend.subject.trim()) dataToSend.subject = "Unknown";
    if (!dataToSend.topic.trim()) dataToSend.topic = "Unknown";
    if (!dataToSend.subtopic.trim()) dataToSend.subtopic = "Unknown";
    if (!dataToSend.solutionExplanation.trim())
      dataToSend.solutionExplanation = "No Explanation!";

    const form = new FormData();
    form.append("data", JSON.stringify(dataToSend));

    if (mediaFile) {
      form.append("media", mediaFile);
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/questions", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        setFormData(INITIAL_FORM);
        setMediaFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        alert("Question uploaded successfully!");
      } else {
        const errData = await res.json();
        alert("Upload failed: " + (errData.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Network Error");
    }
  };

  useEffect(() => {
    if (!mediaFile) return;
    const previewUrl = URL.createObjectURL(mediaFile);
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [mediaFile]);

  return (
    <>
      <AdminLayout />
      <div className="flex justify-center w-full pt-6 bg-indigo-100 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl w-full space-y-4 p-6 bg-white rounded shadow-md text-black flex flex-col gap-4 mb-10"
        >
          {/* Header */}
          <div className="border-b pb-2">
            <h2 className="text-2xl font-bold">Upload New Question</h2>
          </div>

          {/* Row 1: Language */}
          <div className="w-full">
            <select
              name="language"
              required
              value={formData.language}
              className="input border rounded p-2 w-full md:w-1/3"
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
            </select>
          </div>

          {/* Row 2: Subject Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="subject"
              value={formData.subject}
              placeholder="Subject"
              className="input border rounded p-2 w-full"
              onChange={handleChange}
            />

            <input
              name="topic"
              value={formData.topic}
              placeholder="Topic"
              className="input border rounded p-2 w-full"
              onChange={handleChange}
            />

            <input
              name="subtopic"
              value={formData.subtopic}
              placeholder="Subtopic"
              className="input border rounded p-2 w-full"
              onChange={handleChange}
            />
          </div>

          {/* Question Text */}
          <textarea
            name="questionText"
            required
            value={formData.questionText}
            placeholder="Question text"
            className="input border rounded p-2 h-24 w-full"
            onChange={handleChange}
          />

          {/* Media Section (Grey Box) */}
          <div className="p-4 border rounded bg-gray-50">
            <p className="font-semibold mb-2">Media Attachment (Optional)</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100 mb-3"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 10 * 1024 * 1024) {
                  alert("File size must be less than 10MB");
                  return;
                }
                setMediaFile(file);
              }}
            />

            {mediaFile && (
              <div className="mt-2 border p-2 bg-white w-fit rounded">
                <p className="text-xs text-green-600 mb-1">Preview:</p>
                {mediaFile.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(mediaFile)}
                    alt="preview"
                    className="max-h-48 object-contain"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(mediaFile)}
                    controls
                    className="max-h-48"
                  />
                )}
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.options.map((opt, index) => (
              <input
                key={index}
                required
                placeholder={`Option ${index + 1}`}
                value={opt}
                className="input border rounded p-2 w-full"
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            ))}
          </div>

          {/* Correct Option & Solution */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select
              name="correctOptionIndex"
              required
              value={formData.correctOptionIndex}
              className="input border rounded p-2 w-full md:w-1/3"
              onChange={(e) => {
                const index = Number(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  correctOptionIndex: index,
                  solutionText: prev.options[index] || "",
                }));
              }}
            >
              <option value={0}>Correct Option: 1</option>
              <option value={1}>Correct Option: 2</option>
              <option value={2}>Correct Option: 3</option>
              <option value={3}>Correct Option: 4</option>
            </select>

            <input
              name="solutionText"
              value={formData.options[formData.correctOptionIndex] || ""}
              readOnly
              placeholder="Correct Answer Text"
              className="input border rounded p-2 flex-1 bg-gray-100 text-gray-700"
            />
          </div>

          {/* Explanation */}
          <textarea
            name="solutionExplanation"
            placeholder="Solution explanation"
            value={formData.solutionExplanation}
            className="input border rounded p-2 h-20 w-full"
            onChange={handleChange}
          />

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded font-medium transition-colors">
              Upload Question
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default QuestionUpload;
