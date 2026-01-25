import React, { useState } from "react";

const QuizFilters = ({
  config,
  handleConfigChange,
  onSearch,
  loading,
  error,
  dropdownData,
}) => {
  const { subjects, topics, subtopics, isLoading } = dropdownData;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
      {/* --- HEADER (Collapsible) --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50/50 backdrop-blur px-4 py-3 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
            Data Source
          </h2>
        </div>
        <span
          className={`text-slate-400 text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* --- BODY --- */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-5 space-y-5">
          {/* Row 1: Language & Limit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                Language
              </label>
              <div className="relative">
                <select
                  name="language"
                  value={config.language}
                  onChange={handleConfigChange}
                  className="w-full text-xs py-2 pl-2 pr-6 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 font-medium text-slate-700 appearance-none cursor-pointer hover:border-emerald-200 transition-colors"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                Count
              </label>
              <input
                type="number"
                name="limit"
                value={config.limit}
                onChange={handleConfigChange}
                className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 font-medium text-slate-700 hover:border-emerald-200 transition-colors"
              />
            </div>
          </div>

          {/* Row 2: Difficulty Pills */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">
              Difficulty Level
            </label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {["Any", "Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    handleConfigChange({
                      target: { name: "difficulty", value: level },
                    })
                  }
                  className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all duration-200 ${
                    config.difficulty === level
                      ? "bg-white text-emerald-600 shadow-sm ring-1 ring-black/5"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Mode Selection (Tabs) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">
              Selection Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`cursor-pointer flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200 ${
                  config.mode === "mix"
                    ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                    : "bg-slate-50 border-transparent hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value="mix"
                  checked={config.mode === "mix"}
                  onChange={handleConfigChange}
                  className="hidden"
                />
                <span className="text-lg mb-1">🎲</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide ${config.mode === "mix" ? "text-emerald-700" : "text-slate-400"}`}
                >
                  Random Mix
                </span>
              </label>

              <label
                className={`cursor-pointer flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200 ${
                  config.mode === "specific"
                    ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                    : "bg-slate-50 border-transparent hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value="specific"
                  checked={config.mode === "specific"}
                  onChange={handleConfigChange}
                  className="hidden"
                />
                <span className="text-lg mb-1">🎯</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide ${config.mode === "specific" ? "text-emerald-700" : "text-slate-400"}`}
                >
                  Specific
                </span>
              </label>
            </div>
          </div>

          {/* Row 4: Specific Selectors (Animated Entrance) */}
          {config.mode === "specific" && (
            <div className="space-y-3 p-3 bg-white rounded-xl border border-emerald-100 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300">
              <div className="relative">
                <select
                  name="subject"
                  value={config.subject}
                  onChange={handleConfigChange}
                  className="w-full text-xs py-2 pl-2 pr-6 bg-emerald-50/30 border border-emerald-100 rounded-lg text-slate-700 font-medium appearance-none outline-none focus:border-emerald-300"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400 text-[10px]">
                  ▼
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    name="topic"
                    value={config.topic}
                    onChange={handleConfigChange}
                    disabled={!config.subject}
                    className="w-full text-xs py-2 pl-2 pr-6 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-50 disabled:bg-slate-50 appearance-none outline-none focus:border-emerald-300"
                  >
                    <option value="">-- Topic --</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    name="subtopic"
                    value={config.subtopic}
                    onChange={handleConfigChange}
                    disabled={!config.topic}
                    className="w-full text-xs py-2 pl-2 pr-6 bg-slate-50 border border-slate-200 rounded-lg disabled:opacity-50 disabled:bg-slate-50 appearance-none outline-none focus:border-emerald-300"
                  >
                    <option value="">-- Subtopic --</option>
                    {subtopics.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onSearch}
            disabled={loading}
            className="w-full group relative overflow-hidden bg-slate-900 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 transition-all shadow-lg shadow-slate-300 hover:shadow-emerald-200 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>🔍</span>
              )}
              {loading ? "Fetching Data..." : "Find Questions"}
            </span>
          </button>

          {error && (
            <div className="text-[10px] text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 text-center font-medium animate-in shake">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizFilters;
