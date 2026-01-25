import React from "react";

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

const ThemeControls = ({ theme, handleThemeChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🎨</span> Video Design Theme
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Background */}
        <div>
          <label className="block text-sm text-gray-600">Background</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              name="bgColor"
              value={theme.bgColor}
              onChange={handleThemeChange}
              className="h-10 w-10 cursor-pointer"
            />
            <span className="text-xs font-mono">{theme.bgColor}</span>
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm text-gray-600">Text Color</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              name="textColor"
              value={theme.textColor}
              onChange={handleThemeChange}
              className="h-10 w-10 cursor-pointer"
            />
            <span className="text-xs font-mono">{theme.textColor}</span>
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-sm text-gray-600">Accent/Correct</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              name="accentColor"
              value={theme.accentColor}
              onChange={handleThemeChange}
              className="h-10 w-10 cursor-pointer"
            />
            <span className="text-xs font-mono">{theme.accentColor}</span>
          </div>
        </div>

        {/* Fonts */}
        <div>
          <label className="block text-sm text-gray-600">Font Style</label>
          <select
            name="fontFamily"
            onChange={handleThemeChange}
            className="w-full p-2 mt-1 border rounded text-sm"
          >
            <option value="sans-serif">Clean Sans</option>
            <option value="serif">Classic Serif</option>
            <option value="'Courier New', monospace">Typewriter</option>
            <option value="cursive">Playful</option>
          </select>
        </div>
      </div>

      {/* --- 2. ANIMATION STUDIO --- */}
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>🎬</span> Animation Studio
      </h3>

      <div className="space-y-6">
        {/* QUESTION */}
        <div className="bg-gray-50 p-3 rounded border">
          <h4 className="font-bold text-xs text-blue-600 mb-2 border-b pb-1">
            1. QUESTION TEXT
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <AnimationSelect
              label="Entrance"
              name="qEnter"
              value={theme.qEnter}
              onChange={handleThemeChange}
            />
            <AnimationSelect
              label="Exit"
              name="qExit"
              value={theme.qExit}
              onChange={handleThemeChange}
            />
            <DurationInput
              label="Speed"
              name="qDuration"
              value={theme.qDuration}
              onChange={handleThemeChange}
            />
          </div>
        </div>

        {/* OPTIONS */}
        <div className="bg-gray-50 p-3 rounded border">
          <h4 className="font-bold text-xs text-blue-600 mb-2 border-b pb-1">
            2. OPTIONS GRID
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <AnimationSelect
              label="Entrance"
              name="optEnter"
              value={theme.optEnter}
              onChange={handleThemeChange}
            />
            <AnimationSelect
              label="Exit"
              name="optExit"
              value={theme.optExit}
              onChange={handleThemeChange}
            />
            <DurationInput
              label="Speed"
              name="optDuration"
              value={theme.optDuration}
              onChange={handleThemeChange}
            />
          </div>
          <div className="mt-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
              Stagger Delay (s)
            </label>
            <input
              type="range"
              name="optStagger"
              min="0"
              max="0.5"
              step="0.05"
              value={theme.optStagger}
              onChange={handleThemeChange}
              className="w-full"
            />
          </div>
        </div>

        {/* EXPLANATION */}
        <div className="bg-gray-50 p-3 rounded border">
          <h4 className="font-bold text-xs text-blue-600 mb-2 border-b pb-1">
            3. EXPLANATION BOX
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <AnimationSelect
              label="Entrance"
              name="explainEnter"
              value={theme.explainEnter}
              onChange={handleThemeChange}
            />
            <AnimationSelect
              label="Exit"
              name="explainExit"
              value={theme.explainExit}
              onChange={handleThemeChange}
            />
            <DurationInput
              label="Speed"
              name="explainDuration"
              value={theme.explainDuration}
              onChange={handleThemeChange}
            />
          </div>
        </div>

        {/* TIMER */}
        <div className="bg-gray-50 p-3 rounded border">
          <h4 className="font-bold text-xs text-blue-600 mb-2 border-b pb-1">
            4. PROGRESS BAR
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Style
              </label>
              <select
                name="timerColor"
                value={theme.timerColor}
                onChange={handleThemeChange}
                className="w-full p-1 border rounded bg-white text-sm"
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
                <option value="rainbow">Rainbow</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Easing
              </label>
              <select
                name="timerType"
                value={theme.timerType}
                onChange={handleThemeChange}
                className="w-full p-1 border rounded bg-white text-sm"
              >
                <option value="linear">Linear</option>
                <option value="elastic">Elastic</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeControls;
