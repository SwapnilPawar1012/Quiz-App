import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Import components
import QuizFilters from "../components/quiz/QuizFilters";
import ThemeControls from "../components/quiz/ThemeControls";
import VideoPreview from "../components/quiz/VideoPreview";
import GeneratedList from "../components/quiz/GeneratedList";
import TimingControls from "../components/quiz/TimingControls";
import RemotionPlayerWrapper from "../components/quiz/RemotionPlayerWrapper";

const QuizGenerator = () => {
  // --- STATE ---
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

  // TIMING STATE (In Seconds)
  const [timings, setTimings] = useState({
    questionDuration: 3.5,
    timerDuration: 8,
    explanationDuration: 4,
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // --- API CALLS ---
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCats(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/quiz/categories",
        );
        if (Array.isArray(res.data)) setAllCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
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
    const requestedLimit = parseInt(config.limit) + 1;

    const payload = {
      language: config.language,
      limit: requestedLimit,
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
      if (res.data.length === 0) setError("No unused questions found.");
      setQuestions(res.data);
    } catch (err) {
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!window.confirm("Mark main questions as used?")) return;
    const mainQuestions = questions.slice(0, -1);
    const questionIds = mainQuestions.map((q) => q._id);
    await axios.post("http://localhost:5000/api/quiz/mark-used", {
      questionIds,
    });
    alert(`Success! ${questionIds.length} questions marked used.`);
    setQuestions([]);
    setShowPlayer(false);
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    if (name === "subject")
      setConfig((prev) => ({
        ...prev,
        subject: value,
        topic: "",
        subtopic: "",
      }));
    else if (name === "topic")
      setConfig((prev) => ({ ...prev, topic: value, subtopic: "" }));
    else setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (e) =>
    setTheme({ ...theme, [e.target.name]: e.target.value });

  // --- MEMOS ---
  const dropdownData = useMemo(() => {
    if (!allCategories || allCategories.length === 0)
      return {
        subjects: [],
        topics: [],
        subtopics: [],
        isLoading: isLoadingCats,
      };
    const subjects = [
      ...new Set(allCategories.map((c) => c.subject).filter((s) => s)),
    ];
    const topics = config.subject
      ? [
          ...new Set(
            allCategories
              .filter((c) => c.subject === config.subject)
              .map((c) => c.topic)
              .filter((t) => t),
          ),
        ]
      : [];
    const subtopics =
      config.subject && config.topic
        ? [
            ...new Set(
              allCategories
                .filter(
                  (c) =>
                    c.subject === config.subject && c.topic === config.topic,
                )
                .map((c) => c.subtopic)
                .filter((s) => s),
            ),
          ]
        : [];
    return { subjects, topics, subtopics, isLoading: isLoadingCats };
  }, [allCategories, config.subject, config.topic, isLoadingCats]);

  const FPS = 30;
  const totalFrames = Math.max(
    1,
    questions.length *
      ((timings.questionDuration +
        timings.timerDuration +
        timings.explanationDuration) *
        FPS),
  );

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 w-full text-slate-800 font-sans pb-20">
      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* --- LEFT: VISUAL CONTROLS (Narrow) --- */}
          <div className="xl:col-span-3 space-y-4 xl:sticky xl:top-24 z-30">
            <ThemeControls
              theme={theme}
              handleThemeChange={handleThemeChange}
            />
          </div>

          {/* --- CENTER: WORKSPACE (Wide) --- */}
          <div className="xl:col-span-6 space-y-6">
            {/* Player Card */}
            <div className="bg-white p-3 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 rounded-b-xl z-20 opacity-50"></div>
              <div className="aspect-video bg-slate-900 rounded-[1.5rem] overflow-hidden relative isolate ring-1 ring-black/5">
                {showPlayer && questions.length > 0 ? (
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
            </div>

            {/* Generated List (Animated Entry) */}
            {questions.length > 0 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 delay-100">
                {showPlayer && (
                  <div className="text-center mb-6">
                    <button
                      onClick={() => setShowPlayer(false)}
                      className="px-6 py-2 bg-white border border-slate-200 text-slate-500 text-xs font-bold rounded-full hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
                    >
                      Exit Preview Mode
                    </button>
                  </div>
                )}
                <GeneratedList
                  questions={questions}
                  onPreview={() => setShowPlayer(true)}
                  onFinalize={handleFinalize}
                  showPlayer={showPlayer}
                />
              </div>
            )}
          </div>

          {/* --- RIGHT: DATA CONTROLS (Narrow) --- */}
          <div className="xl:col-span-3 space-y-4 xl:sticky xl:top-24 z-30">
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
