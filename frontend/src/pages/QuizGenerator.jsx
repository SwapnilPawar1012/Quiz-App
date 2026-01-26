import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Components
import QuizFilters from "../components/quiz/QuizFilters";
import ThemeControls from "../components/quiz/ThemeControls";
import VideoPreview from "../components/quiz/VideoPreview";
import GeneratedList from "../components/quiz/GeneratedList";
import TimingControls from "../components/quiz/TimingControls";
import RemotionPlayerWrapper from "../components/quiz/RemotionPlayerWrapper";

const QuizGenerator = () => {
  // ---------------- STATE ----------------
  const [config, setConfig] = useState({
    language: "English",
    limit: 10,
    difficulty: "Any",
    mode: "mix",
    subject: "",
    topic: "",
    subtopic: "",
  });

  const [theme, setTheme] = useState({
    bgColor: "#111827",
    textColor: "#F3F4F6",
    accentColor: "#FBBF24",
    fontFamily: "sans-serif",
    qEnter: "zoom",
    qExit: "fade",
    qDuration: 0.5,
    optEnter: "slideUp",
    optExit: "fade",
    optDuration: 0.5,
    optStagger: 0.2,
    optionShape: "rounded",
    borderWidth: "4px",
    timerType: "linear",
    timerColor: "gradient",
    explainEnter: "slideUp",
    explainExit: "slideDown",
    explainDuration: 0.5,
  });

  const [timings, setTimings] = useState({
    questionDuration: 3.5,
    timerDuration: 8,
    explanationDuration: 4,
  });

  const [questions, setQuestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [error, setError] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  // 🔥 REQUIRED STATE (WAS MISSING)
  const [isRendering, setIsRendering] = useState(false);

  // ---------------- API ----------------
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCats(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/quiz/categories",
        );
        if (Array.isArray(res.data)) setAllCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    setShowPlayer(false);

    const payload = {
      language: config.language,
      limit: Number(config.limit) + 1,
      difficulty: config.difficulty === "Any" ? undefined : config.difficulty,
      subject: config.mode === "specific" ? config.subject : undefined,
      topic: config.mode === "specific" ? config.topic : undefined,
      subtopic: config.mode === "specific" ? config.subtopic : undefined,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/quiz/fetch",
        payload,
      );
      setQuestions(res.data || []);
    } catch {
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!window.confirm("Mark main questions as used?")) return;

    const ids = questions.slice(0, -1).map((q) => q._id);
    await axios.post("http://localhost:5000/api/quiz/mark-used", {
      questionIds: ids,
    });

    alert("Questions marked as used.");
    setQuestions([]);
    setShowPlayer(false);
  };

  // ---------------- SAVE TO LAPTOP ----------------
  const handleSaveToLaptop = async () => {
    if (!questions.length) {
      alert("No questions to render.");
      return;
    }

    if (!window.confirm("Save video to laptop?")) return;

    setIsRendering(true);

    try {
      const res = await axios.post("http://localhost:5000/api/video/render", {
        questions,
        theme,
        timings,
        config,
      });

      alert(`✅ Video saved successfully!\n\n${res.data.savedAt}`);
    } catch (err) {
      console.error(err);
      alert("❌ Render failed. Check backend logs.");
    } finally {
      setIsRendering(false);
    }
  };

  // ---------------- HELPERS ----------------
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (e) =>
    setTheme({ ...theme, [e.target.name]: e.target.value });

  const dropdownData = useMemo(() => {
    const subjects = [...new Set(allCategories.map((c) => c.subject))];
    const topics = allCategories
      .filter((c) => c.subject === config.subject)
      .map((c) => c.topic);
    const subtopics = allCategories
      .filter((c) => c.subject === config.subject && c.topic === config.topic)
      .map((c) => c.subtopic);

    return {
      subjects,
      topics,
      subtopics,
      isLoading: isLoadingCats,
    };
  }, [allCategories, config.subject, config.topic, isLoadingCats]);

  const FPS = 30;
  const totalFrames =
    questions.length *
    (timings.questionDuration +
      timings.timerDuration +
      timings.explanationDuration) *
    FPS;

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="xl:col-span-3 space-y-4">
            <ThemeControls
              theme={theme}
              handleThemeChange={handleThemeChange}
            />
          </div>

          {/* CENTER */}
          <div className="xl:col-span-6 space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-xl">
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
                {showPlayer ? (
                  <RemotionPlayerWrapper
                    questions={questions}
                    theme={theme}
                    timings={timings}
                    totalFrames={totalFrames}
                    FPS={FPS}
                  />
                ) : (
                  <VideoPreview
                    theme={theme}
                    title={config.subject || "Quiz"}
                  />
                )}
              </div>

              {questions.length > 0 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleSaveToLaptop}
                    disabled={isRendering}
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50"
                  >
                    {isRendering ? "Rendering..." : "💾 Save Video to Laptop"}
                  </button>
                </div>
              )}
            </div>

            {questions.length > 0 && (
              <GeneratedList
                questions={questions}
                onPreview={() => setShowPlayer(true)}
                onFinalize={handleFinalize}
                showPlayer={showPlayer}
              />
            )}
          </div>

          {/* RIGHT */}
          <div className="xl:col-span-3 space-y-4 text-black">
            <QuizFilters
              config={config}
              handleConfigChange={handleConfigChange}
              onSearch={fetchQuestions}
              loading={loading}
              error={error}
              dropdownData={dropdownData}
            />
            <TimingControls timings={timings} setTimings={setTimings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
