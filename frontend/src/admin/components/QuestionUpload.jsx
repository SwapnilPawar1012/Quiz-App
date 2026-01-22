import React, { useState } from "react";
import AdminPanel from "./AdminPanel";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({ ...formData, options: updatedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending data:", formData);

    // Later: send to backend
    // await fetch("/api/admin/questions", { ... })
  };

  return (
    <>
      <AdminPanel />
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
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
            >
              <option value={0}>Correct Option: 1</option>
              <option value={1}>Correct Option: 2</option>
              <option value={2}>Correct Option: 3</option>
              <option value={3}>Correct Option: 4</option>
            </select>

            <input
              name="solutionText"
              required
              placeholder="Solution text"
              className="input border rounded text-black py-1 px-2"
              onChange={handleChange}
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
