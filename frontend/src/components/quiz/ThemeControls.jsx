import React, {useState} from "react";

const AnimationSelect = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-1 border rounded bg-gray-50 text-sm"
    >
      <option value="fade">Fade</option>
      <option value="zoom">Zoom</option>
      <option value="slideUp">Slide Up</option>
      <option value="slideDown">Slide Down</option>
      <option value="slideLeft">Slide Left</option>
      <option value="slideRight">Slide Right</option>
      <option value="flipX">Flip X</option>
      <option value="bounce">Bounce</option>
      <option value="none">None</option>
    </select>
  </div>
);

const DurationInput = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
      {label} (s)
    </label>
    <input
      type="number"
      step="0.1"
      min="0.1"
      max="2.0"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-1 border rounded bg-gray-50 text-sm"
    />
  </div>
);

const ControlSection = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-slate-50 transition-colors group"
      >
        <span className="flex items-center gap-2 text-xs font-bold text-slate-600 group-hover:text-indigo-600 uppercase tracking-wide">
          <span className="text-lg opacity-80">{icon}</span> {title}
        </span>
        <span
          className={`text-slate-400 text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-4 pt-1 space-y-4">{children}</div>
      </div>
    </div>
  );
};

const ColorPicker = ({ label, name, value, onChange }) => (
  <div className="flex items-center justify-between group">
    <label className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">
      {label}
    </label>
    <div className="flex items-center gap-2 bg-slate-50 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-indigo-200 transition-colors">
      <span className="text-[10px] text-slate-400 font-mono uppercase">
        {value}
      </span>
      <div className="relative w-5 h-5 rounded-full overflow-hidden shadow-sm ring-1 ring-slate-100">
        <input
          type="color"
          name={name}
          value={value}
          onChange={onChange}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] cursor-pointer p-0 border-0"
        />
      </div>
    </div>
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full text-xs py-2 pl-2 pr-6 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.val} value={opt.val}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
        ▼
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const ThemeControls = ({ theme, handleThemeChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50/50 backdrop-blur px-4 py-3 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
          Visual Editor
        </h2>
      </div>

      {/* --- 1. APPEARANCE (Colors & Shapes) --- */}
      <ControlSection title="Appearance" icon="🎨" defaultOpen={true}>
        <div className="space-y-3">
          <ColorPicker
            label="Background"
            name="bgColor"
            value={theme.bgColor}
            onChange={handleThemeChange}
          />
          <ColorPicker
            label="Text Color"
            name="textColor"
            value={theme.textColor}
            onChange={handleThemeChange}
          />
          <ColorPicker
            label="Accent"
            name="accentColor"
            value={theme.accentColor}
            onChange={handleThemeChange}
          />

          <div className="h-px bg-slate-100 my-2"></div>

          <Select
            label="Typography"
            name="fontFamily"
            value={theme.fontFamily}
            onChange={handleThemeChange}
            options={[
              { val: "Inter, sans-serif", label: "Modern Sans (Inter)" },
              { val: "Roboto, sans-serif", label: "Standard (Roboto)" },
              { val: "'Open Sans', sans-serif", label: "Friendly (Open Sans)" },
              { val: "Montserrat, sans-serif", label: "Wide (Montserrat)" },
              { val: "Oswald, sans-serif", label: "Bold (Oswald)" },
              { val: "Merriweather, serif", label: "Elegant (Merriweather)" },
              { val: "'Playfair Display', serif", label: "Fancy (Playfair)" },
              { val: "'Courier New', monospace", label: "Retro (Typewriter)" },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Option Shape"
              name="optionShape"
              value={theme.optionShape}
              onChange={handleThemeChange}
              options={[
                { val: "rounded", label: "Rounded" },
                { val: "pill", label: "Pill / Capsule" },
                { val: "rect", label: "Sharp Rect" },
                { val: "modern", label: "Super Round" },
              ]}
            />
            <Select
              label="Border Width"
              name="borderWidth"
              value={theme.borderWidth}
              onChange={handleThemeChange}
              options={[
                { val: "0px", label: "None" },
                { val: "2px", label: "Thin (2px)" },
                { val: "4px", label: "Bold (4px)" },
                { val: "8px", label: "Heavy (8px)" },
              ]}
            />
          </div>
        </div>
      </ControlSection>

      {/* --- 2. ANIMATIONS --- */}
      <ControlSection title="Motion" icon="🎬">
        <div className="space-y-4">
          {/* Question */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Question
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                label="Entrance"
                name="qEnter"
                value={theme.qEnter}
                onChange={handleThemeChange}
                options={[
                  { val: "zoom", label: "Zoom In" },
                  { val: "slideDown", label: "Drop Down" },
                  { val: "slideLeft", label: "Slide Right" },
                  { val: "fade", label: "Fade Only" },
                ]}
              />
              <Select
                label="Duration"
                name="qDuration"
                value={theme.qDuration}
                onChange={handleThemeChange}
                options={[
                  { val: 0.3, label: "Fast (0.3s)" },
                  { val: 0.5, label: "Normal (0.5s)" },
                  { val: 1.0, label: "Slow (1.0s)" },
                ]}
              />
            </div>
          </div>

          {/* Options */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Options
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                label="Entrance"
                name="optEnter"
                value={theme.optEnter}
                onChange={handleThemeChange}
                options={[
                  { val: "slideUp", label: "Slide Up" },
                  { val: "pop", label: "Pop In" },
                  { val: "flipX", label: "Flip" },
                  { val: "fade", label: "Fade" },
                ]}
              />
              <Select
                label="Stagger"
                name="optStagger"
                value={theme.optStagger}
                onChange={handleThemeChange}
                options={[
                  { val: 0.1, label: "Fast (0.1s)" },
                  { val: 0.2, label: "Normal (0.2s)" },
                  { val: 0.5, label: "Slow (0.5s)" },
                ]}
              />
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Explanation
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                label="Reveal Dir"
                name="explainEnter"
                value={theme.explainEnter}
                onChange={handleThemeChange}
                options={[
                  { val: "slideUp", label: "From Bottom" },
                  { val: "slideLeft", label: "From Left" },
                  { val: "slideRight", label: "From Right" },
                  { val: "fade", label: "Fade" },
                ]}
              />
              <Select
                label="Duration"
                name="explainDuration"
                value={theme.explainDuration}
                onChange={handleThemeChange}
                options={[
                  { val: 0.5, label: "Normal" },
                  { val: 0.8, label: "Slow" },
                ]}
              />
            </div>
          </div>
        </div>
      </ControlSection>

      {/* --- 3. PROGRESS BAR --- */}
      <ControlSection title="Timer Bar" icon="⏳">
        <div className="grid grid-cols-1 gap-3">
          <Select
            label="Visual Style"
            name="timerColor"
            value={theme.timerColor}
            onChange={handleThemeChange}
            options={[
              { val: "gradient", label: "Gradient Fade (Accent → White)" },
              { val: "solid", label: "Solid Accent Color" },
              { val: "rainbow", label: "Rainbow RGB" },
            ]}
          />
          <Select
            label="Animation Easing"
            name="timerType"
            value={theme.timerType}
            onChange={handleThemeChange}
            options={[
              { val: "linear", label: "Linear (Smooth & Constant)" },
              { val: "elastic", label: "Elastic (Bouncy End)" },
            ]}
          />
        </div>
      </ControlSection>
    </div>
  );
};

export default ThemeControls;
