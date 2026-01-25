import React from "react";

const TimingControls = ({ timings, setTimings }) => {
  const handleChange = (e) => {
    setTimings({ ...timings, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>⏱️</span> Timing Settings (Seconds)
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Read Question
          </label>
          <input
            type="number"
            name="questionDuration"
            value={timings.questionDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <span className="text-xs text-gray-400">
            Delay before options appear
          </span>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Timer (Countdown)
          </label>
          <input
            type="number"
            name="timerDuration"
            value={timings.timerDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <span className="text-xs text-gray-400">Time to guess answer</span>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Explanation Time
          </label>
          <input
            type="number"
            name="explanationDuration"
            value={timings.explanationDuration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <span className="text-xs text-gray-400">Time showing solution</span>
        </div>
      </div>
    </div>
  );
};

export default TimingControls;
