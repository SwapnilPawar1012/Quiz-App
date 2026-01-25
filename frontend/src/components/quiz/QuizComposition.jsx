import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// --- ANIMATION ENGINE (Unchanged) ---
const getAnimStyle = (
  frame,
  fps,
  type,
  durationSec,
  startFrame,
  isExit = false,
) => {
  if (!type || type === "none") return {};

  const durationFrames = durationSec * fps;
  const spr = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const t = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const style = { opacity: isExit ? 1 - t : t };
  const dist = 100;

  if (type === "zoom") {
    const scale = isExit
      ? interpolate(t, [0, 1], [1, 0])
      : interpolate(t, [0, 1], [0, 1]);
    style.transform = `scale(${scale})`;
  } else if (type === "slideUp") {
    const y = isExit
      ? interpolate(t, [0, 1], [0, -dist])
      : interpolate(t, [0, 1], [dist, 0]);
    style.transform = `translateY(${y}px)`;
  } else if (type === "slideDown") {
    const y = isExit
      ? interpolate(t, [0, 1], [0, dist])
      : interpolate(t, [0, 1], [-dist, 0]);
    style.transform = `translateY(${y}px)`;
  } else if (type === "slideLeft") {
    const x = isExit
      ? interpolate(t, [0, 1], [0, -dist * 2])
      : interpolate(t, [0, 1], [-dist * 2, 0]);
    style.transform = `translateX(${x}px)`;
  } else if (type === "slideRight") {
    const x = isExit
      ? interpolate(t, [0, 1], [0, dist * 2])
      : interpolate(t, [0, 1], [dist * 2, 0]);
    style.transform = `translateX(${x}px)`;
  } else if (type === "flipX") {
    const rot = isExit
      ? interpolate(t, [0, 1], [0, 90])
      : interpolate(t, [0, 1], [90, 0]);
    style.transform = `perspective(1000px) rotateX(${rot}deg)`;
  } else if (type === "bounce") {
    const b = spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 10, stiffness: 100 },
    });
    const y = isExit ? 0 : interpolate(b, [0, 1], [50, 0]);
    style.transform = `translateY(${y}px)`;
  }
  return style;
};

// Helper: Resolve "Auto" Exit
const resolveExitType = (enterType, exitType) => {
  if (exitType && exitType !== "auto") return exitType;
  switch (enterType) {
    case "slideDown":
      return "slideUp";
    case "slideUp":
      return "slideDown";
    case "slideLeft":
      return "slideRight";
    case "slideRight":
      return "slideLeft";
    case "zoom":
      return "zoom";
    default:
      return "fade";
  }
};

// HELPER: Get Border Radius based on Shape Name
const getBorderRadius = (shape) => {
  switch (shape) {
    case "pill":
      return "9999px"; // Fully rounded ends
    case "rect":
      return "0px"; // Sharp corners
    case "modern":
      return "32px"; // Deeply rounded
    case "rounded":
    default:
      return "16px"; // Standard
  }
};

// --- QUESTION SLIDE COMPONENT ---
const QuestionSlide = ({
  question,
  index,
  theme,
  timings,
  totalQuestions,
  isHomework,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- TIMING ---
  const questionSec = timings.questionDuration * fps;
  const timerSec = timings.timerDuration * fps;
  const explainSec = timings.explanationDuration * fps;
  const totalFrames = questionSec + timerSec + explainSec;

  // --- LOGIC: REVEAL STATUS ---
  // isTimeUp: Determines if the "Thinking Time" is over (timer hits 0)
  const isTimeUp = frame > questionSec + timerSec;

  // shouldReveal: Determines if we show the answer.
  const shouldReveal = isTimeUp && !isHomework;

  // --- 1. QUESTION ANIMATION ---
  const qEnterType = theme.qEnter || "zoom";
  const qExitType = resolveExitType(qEnterType, theme.qExit);
  const qDur = theme.qDuration || 0.5;
  const qExitStart = totalFrames - qDur * fps;

  const qEnterStyle = getAnimStyle(frame, fps, qEnterType, qDur, 0, false);
  const qExitStyle =
    frame > qExitStart
      ? getAnimStyle(frame, fps, qExitType, qDur, qExitStart, true)
      : {};
  const finalQStyle = frame > qExitStart ? qExitStyle : qEnterStyle;

  // --- 2. OPTIONS ANIMATION ---
  const getOptionStyle = (i) => {
    const optEnterType = theme.optEnter || "slideUp";
    const optExitType = resolveExitType(optEnterType, theme.optExit);
    const optDur = theme.optDuration || 0.5;
    const staggerDelay =
      theme.optStagger !== undefined ? theme.optStagger : 0.1;

    const staggerFrames = i * (staggerDelay * fps);
    const startFrame = questionSec + staggerFrames;
    const exitStart = totalFrames - optDur * fps;

    const enter = getAnimStyle(
      frame,
      fps,
      optEnterType,
      optDur,
      startFrame,
      false,
    );
    const exit =
      frame > exitStart
        ? getAnimStyle(frame, fps, optExitType, optDur, exitStart, true)
        : {};

    if (frame < startFrame) return { opacity: 0 };
    if (frame > exitStart) return exit;
    return enter;
  };

  // --- 3. TIMER ANIMATION ---
  const timerStart = questionSec;
  const timerEnd = questionSec + timerSec;
  const linearProgress = interpolate(frame, [timerStart, timerEnd], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let timerBg = theme.accentColor;
  if (theme.timerColor === "gradient")
    timerBg = `linear-gradient(90deg, ${theme.accentColor}, #ffffff)`;
  if (theme.timerColor === "rainbow")
    timerBg = `linear-gradient(90deg, red, orange, yellow, green, blue, purple)`;

  // --- 4. EXPLANATION ANIMATION ---
  const expEnterType = theme.explainEnter || "slideUp";
  const expExitType = resolveExitType(expEnterType, theme.explainExit);
  const expDur = theme.explainDuration || 0.5;

  const explainStart = timerEnd;
  const explainExitStart = totalFrames - expDur * fps;

  const explainEnter = getAnimStyle(
    frame,
    fps,
    expEnterType,
    expDur,
    explainStart,
    false,
  );
  const explainExit = getAnimStyle(
    frame,
    fps,
    expExitType,
    expDur,
    explainExitStart,
    true,
  );
  const finalExplainStyle =
    frame > explainExitStart ? explainExit : explainEnter;

  // GET DYNAMIC STYLES
  const borderRadius = getBorderRadius(theme.optionShape);
  const borderThickness = theme.borderWidth || "4px";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
      className="flex flex-col items-center relative overflow-hidden pt-24 px-12"
    >
      {/* HEADER: Update text for Homework */}
      <div className="absolute top-8 left-10 flex items-center gap-4 opacity-70">
        <span className="text-2xl font-black tracking-widest border-b-4 border-current pb-1">
          {isHomework ? (
            // Special Header for Homework
            <span className="text-yellow-400 animate-pulse">
              HOMEWORK QUESTION
            </span>
          ) : (
            <>
              QUESTION {index + 1}{" "}
              <span className="text-xl font-normal opacity-70">
                / {totalQuestions - 1}
              </span>
            </>
          )}
        </span>
      </div>

      {/* QUESTION */}
      <div className="w-full flex-none flex items-start justify-center mt-8 mb-12 z-10">
        <h1
          style={finalQStyle}
          className="text-6xl md:text-7xl font-extrabold leading-tight text-center drop-shadow-xl max-w-7xl"
        >
          {question.questionText}
        </h1>
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-7xl z-10">
        {question.options.map((opt, i) => {
          const animStyle = getOptionStyle(i);
          let bgColor = "rgba(255,255,255,0.05)";
          let borderColor = "rgba(255,255,255,0.1)";
          let textColor = theme.textColor;
          let opacityMod = 1;

          // REVEAL LOGIC: ONLY IF (shouldReveal) IS TRUE
          if (shouldReveal) {
            if (i === question.correctOptionIndex) {
              bgColor = theme.accentColor;
              borderColor = theme.accentColor;
              textColor = theme.bgColor;
            } else {
              bgColor = "rgba(0,0,0,0.2)";
              borderColor = "transparent";
              textColor = theme.textColor;
              opacityMod = 0.5;
            }
          }

          return (
            <div
              key={i}
              className="flex items-center p-6 rounded-2xl border-4 shadow-xl transition-colors duration-300"
              style={{
                ...animStyle,
                backgroundColor: bgColor,
                borderColor: borderColor,
                color: textColor,
                opacity: animStyle.opacity * opacityMod,

                // --- NEW DYNAMIC STYLES ---
                borderRadius: borderRadius,
                borderWidth: borderThickness,
              }}
            >
              {/* Option Letter Bubble */}
              <div
                className="shrink-0 w-14 h-14 flex items-center justify-center rounded-full text-2xl font-black mr-5 border-4"
                style={{ borderColor: "currentColor", opacity: 0.8 }}
              >
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-3xl md:text-4xl font-bold leading-none mt-1">
                {opt}
              </span>
            </div>
          );
        })}
      </div>

      {/* TIMER: Show for both, but maybe hide for Homework if desired. Keeping it creates urgency. */}
      {!isTimeUp && frame > questionSec && (
        <div className="mt-28 w-[70%] h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full"
            style={{ width: `${linearProgress}%`, background: timerBg }}
          />
        </div>
      )}

      {/* EXPLANATION: ONLY SHOW IF (shouldReveal) IS TRUE */}
      {shouldReveal && (
        <div
          style={{ ...finalExplainStyle, backgroundColor: "rgba(0,0,0,0.9)" }}
          className="absolute bottom-45 w-[75%] py-6 px-8 rounded-3xl border border-gray-700 shadow-2xl flex flex-row items-center gap-6 z-20"
        >
          <div className="bg-green-500/20 p-4 rounded-xl border border-green-500/50">
            <span className="text-4xl">💡</span>
          </div>
          <div className="flex flex-col flex-1">
            {/* CORRECT ANSWER HEADER */}
            <div className="mb-3 border-b border-gray-700 pb-2">
              <span className="text-gray-400 font-bold text-sm uppercase tracking-wider block mb-1">
                Correct Answer
              </span>
              <div className="flex items-center gap-3">
                {/* Option Letter Bubble */}
                <span className="bg-yellow-500 text-black font-black px-3 py-1 rounded text-xl">
                  {String.fromCharCode(65 + question.correctOptionIndex)}
                </span>
                {/* Option Text */}
                <span className="text-yellow-400 font-bold text-2xl leading-none">
                  {question.options[question.correctOptionIndex]}
                </span>
              </div>
            </div>

            {/* EXPLANATION TEXT */}
            <div>
              <span className="text-green-400 font-bold text-sm uppercase tracking-wider block mb-1">
                Why?
              </span>
              <p className="text-2xl text-white font-medium leading-snug opacity-90">
                {question.solutionExplanation ||
                  question.solutionText ||
                  "No explanation provided."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HOMEWORK CALL TO ACTION (Shows instead of Explanation) */}
      {isHomework && isTimeUp && (
        <div
          className="absolute bottom-32 w-full text-center z-20"
          style={finalExplainStyle} // Animate it in
        >
          <div className="inline-block bg-black/80 px-10 py-6 rounded-3xl border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <h2 className="text-4xl font-black text-yellow-400 mb-2">
              DO YOU KNOW THE ANSWER?
            </h2>
            <p className="text-3xl text-white font-bold animate-pulse">
              👇 Comment Below! 👇
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="absolute bottom-6 right-10 text-xl opacity-40">
        <span className="text-red-700 font-extrabold text-4xl">Subscribe</span>{" "}
        for More Quizzes
      </div>
    </AbsoluteFill>
  );
};

// --- MAIN SEQUENCER ---
export const QuizComposition = ({ questions, theme, timings }) => {
  const { fps } = useVideoConfig();
  const durationInFrames =
    (timings.questionDuration +
      timings.timerDuration +
      timings.explanationDuration) *
    fps;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bgColor }}>
      {questions.map((q, i) => {
        // DETECT LAST QUESTION
        const isLastQuestion = i === questions.length - 1;

        return (
          <Sequence
            key={q._id}
            from={i * durationInFrames}
            durationInFrames={durationInFrames}
          >
            <QuestionSlide
              question={q}
              index={i}
              theme={theme}
              timings={timings}
              totalQuestions={questions.length}
              isHomework={isLastQuestion} // <--- PASSING THE PROP HERE
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
