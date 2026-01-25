import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// --- ANIMATION ENGINE (Unchanged from before) ---
const getAnimStyle = (
  frame,
  fps,
  type,
  durationSec,
  startFrame,
  isExit = false,
) => {
  if (type === "none") return {};

  const durationFrames = durationSec * fps;
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });

  const t = isExit
    ? interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

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

const QuestionSlide = ({ question, index, theme, timings, totalQuestions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- TIMING ---
  const questionSec = timings.questionDuration * fps;
  const timerSec = timings.timerDuration * fps;
  const explainSec = timings.explanationDuration * fps;
  const totalFrames = questionSec + timerSec + explainSec;

  // --- 1. QUESTION ANIMATION ---
  const qEnterStyle = getAnimStyle(
    frame,
    fps,
    theme.qEnter,
    theme.qDuration,
    0,
    false,
  );
  const qExitStart = totalFrames - theme.qDuration * fps;
  const qExitStyle =
    frame > qExitStart
      ? getAnimStyle(frame, fps, theme.qExit, theme.qDuration, qExitStart, true)
      : {};
  const finalQStyle = frame > qExitStart ? qExitStyle : qEnterStyle;

  // --- 2. OPTIONS ANIMATION (FIXED STAGGER) ---
  const getOptionStyle = (i) => {
    // 1. Calculate Stagger Delay
    // Defaults to 0.1s if undefined to prevent NaN errors
    const staggerDelay =
      theme.optStagger !== undefined ? theme.optStagger : 0.1;

    // 2. Convert to Frames
    const staggerFrames = i * (staggerDelay * fps);

    // 3. Determine Start Frame: Question End + This Option's specific delay
    const startFrame = questionSec + staggerFrames;

    // 4. Calculate Entrance
    const enter = getAnimStyle(
      frame,
      fps,
      theme.optEnter,
      theme.optDuration,
      startFrame,
      false,
    );

    // 5. Calculate Exit (Common exit time for all options looks cleaner)
    const exitStart = totalFrames - theme.optDuration * fps;
    const exit =
      frame > exitStart
        ? getAnimStyle(
            frame,
            fps,
            theme.optExit,
            theme.optDuration,
            exitStart,
            true,
          )
        : {};

    // 6. Logic:
    // If before start frame? Hide.
    // If after exit start? Show Exit.
    // Else? Show Entrance.
    if (frame < startFrame) return { opacity: 0 };
    if (frame > exitStart) return exit;
    return enter;
  };

  // --- 3. TIMER ANIMATION ---
  // Timer starts AFTER the last option has appeared (optional) or fixed time?
  // Let's keep fixed time for consistency: Question End -> Timer End
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

  const isTimerDone = frame > timerEnd;

  // --- 4. EXPLANATION ANIMATION ---
  const explainStart = timerEnd;
  const explainExitStart = totalFrames - theme.explainDuration * fps;

  const explainEnter = getAnimStyle(
    frame,
    fps,
    theme.explainEnter,
    theme.explainDuration,
    explainStart,
    false,
  );
  const explainExit = getAnimStyle(
    frame,
    fps,
    theme.explainExit,
    theme.explainDuration,
    explainExitStart,
    true,
  );

  const finalExplainStyle =
    frame > explainExitStart ? explainExit : explainEnter;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
      className="flex flex-col items-center relative overflow-hidden pt-24 px-12"
    >
      {/* HEADER */}
      <div className="absolute top-8 left-10 flex items-center gap-4 opacity-70">
        <span className="text-2xl font-black tracking-widest border-b-4 border-current pb-1">
          QUESTION {index + 1}{" "}
          <span className="text-xl font-normal opacity-70">
            / {totalQuestions}
          </span>
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
          // Get the staggered style
          const animStyle = getOptionStyle(i);

          let bgColor = "rgba(255,255,255,0.05)";
          let borderColor = "rgba(255,255,255,0.1)";
          let textColor = theme.textColor;
          let opacityMod = 1;

          if (isTimerDone) {
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
                ...animStyle, // Apply Animation Here
                backgroundColor: bgColor,
                borderColor: borderColor,
                color: textColor,
                opacity: animStyle.opacity * opacityMod,
              }}
            >
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

      {/* TIMER */}
      {!isTimerDone && frame > questionSec && (
        <div className="mt-28 w-[70%] h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full"
            style={{ width: `${linearProgress}%`, background: timerBg }}
          />
        </div>
      )}

      {/* EXPLANATION */}
      {isTimerDone && (
        <div
          style={{ ...finalExplainStyle, backgroundColor: "rgba(0,0,0,0.9)" }}
          className="absolute bottom-45 w-[75%] py-6 px-8 rounded-3xl border border-gray-700 shadow-2xl flex flex-row items-center gap-6 z-20"
        >
          <div className="bg-green-500/20 p-4 rounded-xl border border-green-500/50">
            <span className="text-4xl">💡</span>
          </div>
          <div className="flex flex-col">
            <span className="text-yellow-400 font-black text-3xl mb-1 tracking-wider">
              Correct Answer:{" "}
              {String.fromCharCode(65 + question.correctOptionIndex)}
            </span>
            <span className="text-green-400 font-bold text-3xl uppercase tracking-widest mb-1">
              Explanation
            </span>
            <p className="text-3xl font-medium leading-snug text-white">
              {question.solutionExplanation ||
                question.solutionText ||
                "No explanation provided."}
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

export const QuizComposition = ({ questions, theme, timings }) => {
  const { fps } = useVideoConfig();
  const durationInFrames =
    (timings.questionDuration +
      timings.timerDuration +
      timings.explanationDuration) *
    fps;
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bgColor }}>
      {questions.map((q, i) => (
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
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
