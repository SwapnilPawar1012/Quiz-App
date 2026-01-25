import React from "react";
import { Player } from "@remotion/player";
import { QuizComposition } from "./QuizComposition"; // Ensure this path is correct

const RemotionPlayerWrapper = ({
  questions,
  theme,
  timings,
  totalFrames,
  FPS,
}) => {
  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border-4 border-gray-800">
      {/* Header Bar */}
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono flex justify-between">
        <span>HD PREVIEW (1920x1080)</span>
        <span>
          {questions.length > 0 ? "READY TO PLAY" : "WAITING FOR DATA"}
        </span>
      </div>

      {/* Logic: Show Player if questions exist, otherwise show placeholder */}
      {questions.length > 0 ? (
        <Player
          component={QuizComposition}
          inputProps={{ questions, theme, timings }}
          durationInFrames={totalFrames}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={FPS}
          controls
          style={{
            width: "100%",
            aspectRatio: "16/9",
          }}
        />
      ) : (
        /* Placeholder State */
        <div
          className="w-full aspect-video flex flex-col items-center justify-center text-center p-8 transition-colors"
          style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
        >
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-bold opacity-80">Video Preview</h3>
          <p className="opacity-60 text-sm mt-2 max-w-xs">
            Select your filters and click "Preview Questions" to generate the
            video timeline.
          </p>
        </div>
      )}
    </div>
  );
};

export default RemotionPlayerWrapper;
