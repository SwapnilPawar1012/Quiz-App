import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Player } from "@remotion/player";

// Import components
import QuizFilters from "../components/quiz/QuizFilters";
import ThemeControls from "../components/quiz/ThemeControls";
import VideoPreview from "../components/quiz/VideoPreview";
import GeneratedList from "../components/quiz/GeneratedList";
import TimingControls from "../components/quiz/TimingControls";
import { QuizComposition } from "../components/quiz/QuizComposition";
import RemotionPlayerWrapper from "../components/quiz/RemotionPlayerWrapper";

const QuizGenerator = () => {
  // --- STATE ---
  const [config, setConfig] = useState({
    language: "English",
    limit: 10,
    mode: "mix",
    subject: "",
    topic: "",
    subtopic: "",
  });

  const [theme, setTheme] = useState({
    bgColor: "#1e1e2f",
    textColor: "#ffffff",
    accentColor: "#fbbf24",
    fontFamily: "sans-serif",

    // --- NEW ANIMATION DEFAULTS ---
    // Question
    qEnter: "zoom", // Entrance Type
    qExit: "fade", // Exit Type
    qDuration: 0.5, // Animation Speed (sec)

    // Options
    optEnter: "slideUp",
    optExit: "fade",
    optDuration: 0.5,
    optStagger: 0.2, // Delay between options

    // Timer
    timerType: "linear", // linear, ease
    timerColor: "gradient", // solid, gradient

    // Explanation
    explainEnter: "slideUp",
    explainExit: "slideDown",
    explainDuration: 0.5,
  });

  // TIMING STATE (In Seconds)
  const [timings, setTimings] = useState({
    questionDuration: 3.5, // Time to read question
    timerDuration: 8, // Countdown time
    explanationDuration: 4, // Time to read explanation
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Category State
  const [allCategories, setAllCategories] = useState([]);
  const [isLoadingCats, setIsLoadingCats] = useState(false);

  // Toggle between Design Mode (Static) and Play Mode (Remotion)
  const [showPlayer, setShowPlayer] = useState(false);

  // --- API CALLS ---

  // --- 1. FETCH CATEGORIES (With Debugging) ---
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCats(true);
      try {
        console.log("Fetching categories...");
        const res = await axios.get(
          "http://localhost:5000/api/quiz/categories",
        );

        console.log("Raw Category Data from DB:", res.data); // <--- CHECK THIS IN CONSOLE

        if (Array.isArray(res.data)) {
          setAllCategories(res.data);
        } else {
          console.error("API did not return an array!", res.data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Could not load categories. Is the backend running?");
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Questions
  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    // Ensure we handle "All Subjects" mode correctly
    const payload = {
      language: config.language,
      limit: config.limit,
      subject: config.mode === "specific" ? config.subject : undefined,
      topic: config.mode === "specific" ? config.topic : undefined,
      subtopic: config.mode === "specific" ? config.subtopic : undefined,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/quiz/fetch",
        payload,
      );
      console.log("Fetched Questions:", res.data); // Debug log
      if (res.data.length === 0)
        setError("No unused questions found for these criteria.");
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch questions. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Generate Video Action
  const handleGenerateVideo = async () => {
    if (!window.confirm("Mark questions as used and start video generation?"))
      return;

    const questionIds = questions.map((q) => q._id);
    await axios.post("http://localhost:5000/api/quiz/mark-used", {
      questionIds,
    });

    const exportData = { meta: { ...config, ...theme }, questions };
    console.log("SENDING TO VIDEO RENDERER:", exportData);
    alert("Questions marked used! Check console for Export Data.");
    setQuestions([]);
  };

  // Finalize: Send to DB
  const handleFinalize = async () => {
    if (!window.confirm("Mark questions as used? This cannot be undone."))
      return;
    const questionIds = questions.map((q) => q._id);
    await axios.post("http://localhost:5000/api/quiz/mark-used", {
      questionIds,
    });
    alert("Success! Questions marked as used.");
    setQuestions([]);
    setShowPlayer(false);
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    console.log(`User changed ${name} to:`, value); // Debug log

    if (name === "subject") {
      // Reset topic/subtopic when subject changes
      setConfig((prev) => ({
        ...prev,
        subject: value,
        topic: "",
        subtopic: "",
      }));
    } else if (name === "topic") {
      // Reset subtopic when topic changes
      setConfig((prev) => ({ ...prev, topic: value, subtopic: "" }));
    } else {
      setConfig((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleThemeChange = (e) =>
    setTheme({ ...theme, [e.target.name]: e.target.value });

  // --- DYNAMIC FILTERS (Robust Version) ---
  const dropdownData = useMemo(() => {
    // Safety check: ensure allCategories is an array
    if (!allCategories || allCategories.length === 0) {
      return {
        subjects: [],
        topics: [],
        subtopics: [],
        isLoading: isLoadingCats,
      };
    }

    // 1. Get Subjects (Filter out nulls)
    const subjects = [
      ...new Set(
        allCategories.map((c) => c.subject).filter((s) => s && s.trim() !== ""), // Remove empty/null subjects
      ),
    ];

    // 2. Get Topics (Dependent on Subject)
    const topics = config.subject
      ? [
          ...new Set(
            allCategories
              .filter((c) => c.subject === config.subject)
              .map((c) => c.topic)
              .filter((t) => t && t.trim() !== ""), // Remove empty topics
          ),
        ]
      : [];

    // 3. Get Subtopics (Dependent on Subject & Topic)
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
                .filter((st) => st && st.trim() !== ""),
            ),
          ]
        : [];

    return { subjects, topics, subtopics, isLoading: isLoadingCats };
  }, [allCategories, config.subject, config.topic, isLoadingCats]);

  // Calculate Total Video Frames for the Player
  const FPS = 30;
  const slideDurationInFrames =
    (timings.questionDuration +
      timings.timerDuration +
      timings.explanationDuration) *
    FPS;
  const totalFrames = Math.max(1, questions.length * slideDurationInFrames);

  return (
    <div className="max-w-7xl mx-auto p-6 text-black space-y-8">
      {/* --- TOP SECTION: CONTROLS --- */}
      {/* Mobile: 1 Column (Stacked). Desktop: 3 Columns (Row) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuizFilters
          config={config}
          handleConfigChange={handleConfigChange}
          onSearch={fetchQuestions}
          loading={loading}
          error={error}
          dropdownData={dropdownData}
        />

        <TimingControls timings={timings} setTimings={setTimings} />

        <ThemeControls theme={theme} handleThemeChange={handleThemeChange} />
      </div>

      {/* --- BOTTOM SECTION: PLAYER & LIST --- */}
      {/* Grid Container: 1 column on mobile, 12 columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDE: Question List (Takes 4/12 columns) */}
        {/* Only render this column if we have questions */}
        {questions.length > 0 && (
          <div className="lg:col-span-4 order-2 lg:order-1 h-full">
            <GeneratedList
              questions={questions}
              // Button 1: Load Player
              onPreview={() => setShowPlayer(true)}
              // Button 2: Finalize
              onFinalize={handleFinalize}
              showPlayer={showPlayer}
            />
          </div>
        )}

        {/* RIGHT SIDE: Video Area (Takes remaining columns) */}
        {/* If questions exist, take 8 columns. If empty, take full 12 columns. */}
        <div
          className={`${questions.length > 0 ? "lg:col-span-8" : "lg:col-span-12"} order-1 lg:order-2`}
        >
          {/* TOGGLE VIEW: Static Preview OR Real Player */}
          {showPlayer && questions.length > 0 ? (
            <div className="space-y-4">
              <RemotionPlayerWrapper
                questions={questions}
                theme={theme}
                timings={timings}
                totalFrames={totalFrames}
                FPS={FPS}
              />
              <button
                onClick={() => setShowPlayer(false)}
                className="text-sm text-gray-500 underline hover:text-gray-800"
              >
                ← Back to Theme Editor
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* The Static Preview for Design Mode */}
              <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border-4 border-gray-800">
                <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono flex justify-between">
                  <span>DESIGN PREVIEW</span>
                  <span>STATIC MODE</span>
                </div>
                {/* This preserves the 16:9 ratio cleanly */}
                <VideoPreview theme={theme} title={config.subject || "Quiz"} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;
