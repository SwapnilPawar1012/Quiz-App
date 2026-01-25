import React, { useState } from "react";

// Sub-component for individual time settings
const TimeInput = ({
  label,
  name,
  value,
  onChange,
  min = 1,
  max = 20,
  colorClass,
}) => (
  <div className="group">
    <div className="flex justify-between items-end mb-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
        {label}
      </label>
      <span className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
        {value}s
      </span>
    </div>

    <div className="flex items-center gap-3">
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step="0.5"
        value={value}
        onChange={onChange}
        className={`w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-${colorClass}-500 hover:accent-${colorClass}-600 transition-all`}
      />
      <input
        type="number"
        name={name}
        min={min}
        max={max}
        step="0.5"
        value={value}
        onChange={onChange}
        className="w-12 text-xs p-1.5 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-indigo-400 font-medium"
      />
    </div>
  </div>
);

const TimingControls = ({ timings, setTimings }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimings((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  // Calculate Total Slide Time
  const totalDuration =
    (timings.questionDuration || 0) +
    (timings.timerDuration || 0) +
    (timings.explanationDuration || 0);

  // Calculate percentages for the visual bar
  const qPct = (timings.questionDuration / totalDuration) * 100;
  const tPct = (timings.timerDuration / totalDuration) * 100;
  const ePct = (timings.explanationDuration / totalDuration) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
      {/* --- HEADER (Collapsible Trigger) --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50/50 backdrop-blur px-4 py-3 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
            Timing & Pacing
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 rounded border border-slate-100">
            {totalDuration}s / Slide
          </span>
          <span
            className={`text-slate-400 text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </div>
      </button>

      {/* --- BODY --- */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-5 space-y-6">
          {/* 1. INPUT SLIDERS */}
          <div className="space-y-5">
            <TimeInput
              label="1. Reading Time (Blue)"
              name="questionDuration"
              value={timings.questionDuration}
              onChange={handleChange}
              colorClass="blue"
            />

            <TimeInput
              label="2. Thinking Time (Orange)"
              name="timerDuration"
              value={timings.timerDuration}
              onChange={handleChange}
              colorClass="orange"
            />

            <TimeInput
              label="3. Explanation Time (Green)"
              name="explanationDuration"
              value={timings.explanationDuration}
              onChange={handleChange}
              colorClass="emerald"
            />
          </div>

          {/* 2. VISUAL TIMELINE BAR */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1.5 uppercase">
              <span>Timeline Preview</span>
              <span>{totalDuration}s Total</span>
            </div>

            {/* The Bar */}
            <div className="h-3 w-full rounded-full flex overflow-hidden ring-1 ring-slate-100">
              <div
                style={{ width: `${qPct}%` }}
                className="h-full bg-blue-400 hover:bg-blue-500 transition-colors"
                title={`Question: ${timings.questionDuration}s`}
              />
              <div
                style={{ width: `${tPct}%` }}
                className="h-full bg-orange-400 hover:bg-orange-500 transition-colors"
                title={`Timer: ${timings.timerDuration}s`}
              />
              <div
                style={{ width: `${ePct}%` }}
                className="h-full bg-emerald-400 hover:bg-emerald-500 transition-colors"
                title={`Explanation: ${timings.explanationDuration}s`}
              />
            </div>

            {/* Legend */}
            <div className="flex gap-3 mt-2 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-[9px] text-slate-500 font-medium">
                  Read
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                <span className="text-[9px] text-slate-500 font-medium">
                  Timer
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span className="text-[9px] text-slate-500 font-medium">
                  Solution
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimingControls;
