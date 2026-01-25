import React from 'react';

const QuizFilters = ({ 
  config, 
  handleConfigChange, 
  onSearch, 
  loading, 
  error, 
  dropdownData, // { subjects, topics, subtopics, isLoading }
}) => {
  const { subjects, topics, subtopics, isLoading } = dropdownData;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>⚙️</span> Quiz Configuration
      </h2>

      {/* Language & Count */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            name="language"
            className="input border rounded p-2 flex-1 bg-gray-100 text-gray-700 w-full"
            onChange={handleConfigChange}
            value={config.language}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Count</label>
          <input
            type="number"
            name="limit"
            value={config.limit}
            onChange={handleConfigChange}
            className="input border rounded p-2 flex-1 bg-gray-100 text-gray-700 w-full"
          />
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Source Mode</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio" name="mode" value="mix"
              checked={config.mode === "mix"}
              onChange={handleConfigChange}
            />
            <span className="font-medium text-black">Mix (All Subjects)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio" name="mode" value="specific"
              checked={config.mode === "specific"}
              onChange={handleConfigChange}
            />
            <span className="font-medium">Specific Category</span>
          </label>
        </div>
      </div>

      {/* Conditional Dropdowns */}
      {config.mode === "specific" && (
        <div className="space-y-3 bg-gray-50 p-4 rounded border">
          {isLoading ? (
            <div className="text-sm text-gray-500 text-center py-2">Loading categories...</div>
          ) : (
            <>
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                <select
                  name="subject" value={config.subject} onChange={handleConfigChange}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Topic</label>
                <select
                  name="topic" value={config.topic} onChange={handleConfigChange}
                  disabled={!config.subject}
                  className={`w-full p-2 border rounded ${!config.subject ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
                >
                  <option value="">-- Select Topic --</option>
                  {topics.map((top) => <option key={top} value={top}>{top}</option>)}
                </select>
              </div>

              {/* Subtopic */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtopic</label>
                <select
                  name="subtopic" value={config.subtopic} onChange={handleConfigChange}
                  disabled={!config.topic}
                  className={`w-full p-2 border rounded ${!config.topic ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
                >
                  <option value="">-- Select Subtopic --</option>
                  {subtopics.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={onSearch}
        disabled={loading}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold transition"
      >
        {loading ? "Searching..." : "Preview Questions"}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default QuizFilters;