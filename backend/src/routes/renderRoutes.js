import express from "express";
import path from "path";
import fs from "fs";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind";

const router = express.Router();
const normalizePath = (p) => p.split(path.sep).join("/");

router.post("/render", async (req, res) => {
  try {
    const { questions, theme, timings } = req.body;
    // 🔥 Cache Remotion bundle across renders (FIXES ERROR + SPEED BOOST)
    let cachedBundle = null;

    // 1. SANITIZE DATA
    const plainQuestions = JSON.parse(JSON.stringify(questions || []));

    if (!plainQuestions || plainQuestions.length === 0) {
      throw new Error("❌ API ERROR: No questions received.");
    }

    // 2. CALCULATE DURATION
    const FPS = 24;
    const qDur = Number(timings?.questionDuration) || 4;
    const tDur = Number(timings?.timerDuration) || 5;
    const eDur = Number(timings?.explanationDuration) || 3;

    const durationPerSlide = (qDur + tDur + eDur) * FPS;
    const totalFrames = Math.round(plainQuestions.length * durationPerSlide);
    const finalDuration = Math.max(300, totalFrames);

    console.log("------------------------------------------------");
    console.log(`🎬 STARTING RENDER: ${plainQuestions.length} Questions`);
    console.log(
      `⏱️ DURATION: ${finalDuration} Frames (~${Math.round(finalDuration / 30)}s)`,
    );
    console.log("------------------------------------------------");

    // 3. PATHS
    const backendRoot = process.cwd();
    const projectRoot = path.join(backendRoot, "..");
    const frontendRoot = path.join(projectRoot, "frontend");
    const entryPoint = path.join(frontendRoot, "src", "remotion.jsx");

    if (!fs.existsSync(entryPoint))
      throw new Error(`Entry point NOT FOUND at: ${entryPoint}`);

    // 4. BUNDLE
    console.log("📦 Bundling resources...");
    const tailwindConfig = {
      content: [
        normalizePath(
          path.join(frontendRoot, "src", "**", "*.{js,ts,jsx,tsx}"),
        ),
      ],
      theme: { extend: {} },
      plugins: [],
    };

    if (!cachedBundle) {
      console.log("📦 Bundling Remotion project (first time only)...");
      cachedBundle = await bundle(entryPoint, () => undefined, {
        webpackOverride: (config) =>
          enableTailwind(config, { config: tailwindConfig }),
      });
    }

    const bundled = cachedBundle;

    // 5. COMPOSITION
    const comps = await getCompositions(bundled);
    const composition = comps.find((c) => c.id === "QuizComp");
    if (!composition) throw new Error("Composition 'QuizComp' not found");

    // 6. RENDER
    // ✅ SAVE DIRECTLY TO LAPTOP FOLDER (YOUR PATH)
    const outputDir = "D:/YT/ScreenRecording/QuizApp_Recording";

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `quiz_${Date.now()}.mp4`;
    const outputLocation = path.join(outputDir, fileName);

    console.log(`🎥 Rendering to ${outputLocation}`);
    console.log("⏳ Please wait, this may take a few minutes...");

    await renderMedia({
      composition,
      serveUrl: bundled,
      codec: "h264",
      outputLocation,
      inputProps: {
        questions: plainQuestions,
        theme,
        timings,
      },
      durationInFrames: finalDuration,
      fps: FPS,
      chromiumOptions: { gl: "angle" },
      envVariables: {
        NODE_ENV: "production",
      },
      onProgress: ({ progress }) => {
        const percent = Math.round(progress * 100);
        if (percent % 5 === 0) {
          process.stdout.write(`\r🚀 Rendering: ${percent}% complete...`);
        }
      },
    });

    console.log("\n✅ Render Success!");

    res.json({
      success: true,
      savedAt: outputLocation,
    });

    console.log("\n✅ Render Success!");
    alert(`Saved at: ${outputLocation}`);
    res.json({
      success: true,
      savedAt: outputLocation,
    });
  } catch (error) {
    console.error("\n❌ RENDER FAILED:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
