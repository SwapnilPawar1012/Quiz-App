import React from 'react';

const VideoPreview = ({ theme, title }) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border-4 border-gray-800">
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono flex justify-between">
        <span>VIDEO PREVIEW (16:9)</span>
        <span>1920x1080</span>
      </div>
      
      {/* The Visual Stage */}
      <div
        className="w-full aspect-video flex flex-col items-center justify-center p-8 text-center transition-colors"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
        }}
      >
        <div className="text-xl font-bold mb-4 opacity-80 uppercase tracking-widest">
          {title || "General Knowledge"} Quiz
        </div>
        <h2 className="text-3xl font-extrabold mb-8 leading-tight">
          What is the capital city of France?
        </h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          {["Berlin", "Madrid", "Paris", "Rome"].map((opt, i) => (
            <div
              key={i}
              className="p-4 rounded text-lg font-semibold border-2"
              style={{
                borderColor: theme.accentColor,
                color: i === 2 ? theme.bgColor : theme.textColor,
                backgroundColor: i === 2 ? theme.accentColor : "transparent",
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;