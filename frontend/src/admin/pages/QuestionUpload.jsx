import { useState, useEffect } from "react";
import AdminLayout from "../components/layout/AdminLayout";

const QuestionUpload = () => {
  const [formData, setFormData] = useState({
    language: "English",
    subject: "Unknown",
    topic: "Unknown",
    subtopic: "Unknown",
    questionText: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    solutionText: "",
    solutionExplanation: "No Explanation!",
  });

  const [mediaFile, setMediaFile] = useState(null);

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

    const form = new FormData();

    form.append("data", JSON.stringify(formData));

    if (mediaFile) {
      form.append("media", mediaFile);
    }

    console.log("Sending data:", formData, mediaFile);

    // Later: send to backend
    // await fetch("http://localhost:5000/api/admin/questions", {
    //   method: "POST",
    //   body: form,
    // });
  };

  useEffect(() => {
    return () => {
      if (mediaFile) {
        // URL.revokeObjectURL(mediaFile);
        const previewUrl = URL.createObjectURL(mediaFile);
        console.log(previewUrl);
      }
    };
  }, [mediaFile]);

  return (
    <>
      <AdminLayout />
      <div className="flex justify-center w-full pt-6 bg-indigo-100">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl space-y-4 p-5 text-black flex flex-col gap-4"
        >
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Fill Question Details</h2>

            <button className="bg-indigo-600 text-white px-6 py-2 rounded">
              Upload Question
            </button>
          </div>

          <div className="flex justify-between gap-3">
            <select
              name="language"
              required
              value={formData.language}
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
          </div>

          <textarea
            name="questionText"
            required
            placeholder="Question text"
            className="input w-full h-9 border rounded text-black py-1 px-2"
            onChange={handleChange}
          />

          <>
            {/* Optional Image / Video */}
            <input
              type="file"
              accept="image/*,video/*"
              className="input w-fit border rounded text-black py-1 px-2"
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
              <div>
                {mediaFile.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(mediaFile)}
                    alt="preview"
                    style={{ maxWidth: "150px" }}
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(mediaFile)}
                    controls
                    style={{ maxWidth: "150px" }}
                  />
                )}
              </div>
            )}
          </>

          <div className="flex justify-between">
            <div className="flex justify-between w-6/12 gap-4 flex-wrap">
              {formData.options.map((opt, index) => (
                <input
                  key={index}
                  required
                  placeholder={`Option ${index + 1}`}
                  className="input border rounded text-black py-1 px-2"
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
            </div>

            <select
              name="correctOptionIndex"
              required
              value={formData.correctOptionIndex}
              className="input border rounded text-black py-1 px-2"
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
              value={formData.options[formData.correctOptionIndex] || "-"}
              readOnly
              className="input border rounded text-black py-1 px-2"
            />
          </div>

          <textarea
            name="solutionExplanation"
            placeholder="Solution explanation"
            className="input  w-full h-18 border rounded text-black py-1 px-2"
            onChange={handleChange}
          />
        </form>
      </div>
    </>
  );
};

export default QuestionUpload;
