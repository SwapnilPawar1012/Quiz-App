import React from "react";
import { registerRoot, Composition } from "remotion";
import "./index.css";
import { QuizComposition } from "./components/quiz/QuizComposition";

// 🔥 Cache Remotion bundle (huge speed boost)
let cachedBundle = null;

// --- DUMMY DATA FOR PREVIEW MODE ---
const PREVIEW_DATA = {
  questions: [
    {
      questionText: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctOptionIndex: 1,
      solutionExplanation:
        "Mars is red because of iron oxide (rust) on its surface.",
    },
    {
      questionText: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctOptionIndex: 2,
      solutionExplanation:
        "Paris is the capital and most populous city of France.",
    },
  ],
  theme: {
    bgColor: "#111827",
    textColor: "#ffffff",
    accentColor: "#FBBF24",
    fontFamily: "Arial, sans-serif",
  },
  timings: {
    questionDuration: 4,
    timerDuration: 5,
    explanationDuration: 3,
  },
};

export const RemotionVideo = () => {
  return (
    <Composition
      id="QuizComp"
      component={QuizComposition}
      durationInFrames={30 * 60 * 10} // MAX duration, backend controls actual length
      fps={24}
      width={1920}
      height={1080}
      // 👇 THIS FIXES THE PREVIEW 👇
      defaultProps={PREVIEW_DATA}
      acknowledgeRemotionLicense
    />
  );
};

registerRoot(RemotionVideo);
