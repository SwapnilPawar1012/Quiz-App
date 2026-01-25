import React from "react";

const GeneratedList = ({ questions, onPreview, onFinalize, showPlayer }) => {
  if (questions.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">
          Found {questions.length} Questions
        </h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          Unused
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2 mb-4 pr-2 custom-scrollbar">
        {questions.map((q, i) => (
          <div
            key={q._id}
            className="text-sm p-3 bg-gray-50 border rounded flex justify-between items-center hover:bg-gray-100"
          >
            <div className="flex gap-2 overflow-hidden">
              <span className="font-bold text-gray-500">{i + 1}.</span>
              <span className="truncate">{q.questionText}</span>
            </div>
            {/* Show Correct Option Badge */}
            <span className="text-xs font-mono bg-gray-200 px-2 rounded">
              Opt {String.fromCharCode(65 + q.correctOptionIndex)}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Step 1: VIEW PLAYER (Only show if not already viewing player) */}
        {!showPlayer && (
          <button
            onClick={onPreview}
            className="w-full bg-blue-600 text-white py-3 rounded text-lg font-bold hover:bg-blue-700 shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>🎬</span> Load in Video Player
          </button>
        )}

        {/* Step 2: FINALIZE (Always available, but highlighted if player is open) */}
        <button
          onClick={onFinalize}
          className={`w-full py-3 rounded text-lg font-bold shadow-lg transition flex items-center justify-center gap-2 ${
            showPlayer
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed" // Discourage finalizing before previewing
          }`}
          disabled={!showPlayer} // Optional: Force them to preview first? Remove if annoying.
        >
          <span>✅</span> Mark as Used & Finish
        </button>
      </div>
    </div>
  );
};

export default GeneratedList;
