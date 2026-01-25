import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    language: { type: String, default: "English" },
    subject: { type: String, default: "Unknown" },
    topic: { type: String, default: "Unknown" },
    subtopic: { type: String, default: "Unknown" },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
      index: true,
    },

    questionText: { type: String, required: true },

    options: {
      type: [String],
      required: true,
      validate: [(arr) => arr.length === 4, "4 options required"],
    },

    correctOptionIndex: { type: Number, required: true },

    solutionText: String,
    solutionExplanation: { type: String, default: "No Explanation!" },

    mediaUrl: { type: String, default: null },
    mediaType: { type: String, default: null }, // image/* or video/*

    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Question", questionSchema);
