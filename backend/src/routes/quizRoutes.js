import express from "express";
import Question from "../models/Question.js"; // Ensure .js extension is present

const router = express.Router();

// --- 1. GET CATEGORIES (Subject -> Topic -> Subtopic) ---
router.get("/categories", async (req, res) => {
  try {
    const categories = await Question.aggregate([
      { $match: { isUsed: false } }, // Only unused questions
      {
        $group: {
          _id: {
            subject: "$subject",
            topic: "$topic",
            subtopic: "$subtopic",
          },
        },
      },
      { $sort: { "_id.subject": 1, "_id.topic": 1 } },
    ]);

    // Flatten the result
    const flatList = categories.map((item) => item._id);
    res.json(flatList);
  } catch (error) {
    console.error("Category Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// --- 2. FETCH RANDOM UNUSED QUESTIONS ---
router.post("/fetch", async (req, res) => {
  try {
    const { language, subject, topic, subtopic, limit } = req.body;
    const count = parseInt(limit) || 10;

    const matchStage = {
      isUsed: false,
      ...(language && { language }),
      // If subject is provided, match it. If not, it fetches from ALL subjects
      ...(subject && { subject: new RegExp(subject, "i") }),
      ...(topic && { topic: new RegExp(topic, "i") }),
      ...(subtopic && { subtopic: new RegExp(subtopic, "i") }),
    };

    const questions = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: count } },
    ]);

    res.json(questions);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// --- 3. MARK QUESTIONS AS USED ---
router.post("/mark-used", async (req, res) => {
  try {
    const { questionIds } = req.body;

    if (!questionIds || questionIds.length === 0) {
      return res.status(400).json({ message: "No IDs provided." });
    }

    await Question.updateMany(
      { _id: { $in: questionIds } },
      { $set: { isUsed: true } },
    );

    res.json({
      success: true,
      message: `Marked ${questionIds.length} questions as used.`,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
