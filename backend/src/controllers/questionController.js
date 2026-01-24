import Question from "../models/Question.js";
import fs from "fs"; // Import file system module
import path from "path";
import { fileURLToPath } from "url";

// Helper for file paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadQuestion = async (req, res) => {
  try {
    if (!req.body.data) {
      return res.status(400).json({ error: "Missing question data" });
    }

    console.log("----- REQUEST RECEIVED -----");

    console.log("req.body:", req.body); // text fields
    console.log("req.body.data:", req.body.data); // JSON string
    console.log("req.file:", req.file); // image/video info

    const data = JSON.parse(req.body.data);
    console.log("PARSED DATA:", data); // actual question object

    // 1. DUPLICATE CHECK
    // Check if a question with the same text AND subject already exists
    const existingQuestion = await Question.findOne({
      questionText: data.questionText,
      subject: data.subject,
    });

    if (existingQuestion) {
      // ⚠️ IMPORTANT: If duplicate, delete the uploaded file so it doesn't clutter storage
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(409).json({
        error:
          "Duplicate Question: This question already exists in this subject.",
      });
    }

    // 2. Create and Save if unique
    const question = new Question({
      ...data,
      mediaUrl: req.file ? `/uploads/questions/${req.file.filename}` : null,
      mediaType: req.file ? req.file.mimetype : null,
    });

    await question.save();

    res.status(201).json({
      success: true,
      message: "Question uploaded successfully",
      question,
    });
  } catch (error) {
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
};

export const bulkUploadQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "No questions data provided" });
    }

    console.log(`Received ${questions.length} questions for bulk upload.`);

    // 1. Identify all question texts in the incoming batch
    const incomingTexts = questions.map((q) => q.questionText);

    // 2. Find which of these texts already exist in the DB
    // We fetch 'questionText' and 'subject' to compare accurately
    const existingInDb = await Question.find({
      questionText: { $in: incomingTexts },
    }).select("questionText subject");

    // 3. Create a "Set" of existing identifiers for fast lookup
    // Format: "Subject|QuestionText"
    const existingSet = new Set(
      existingInDb.map((q) => `${q.subject}|${q.questionText}`),
    );

    // 4. Filter the incoming questions
    // Keep only those NOT in the existingSet
    const newQuestions = questions.filter((q) => {
      const identifier = `${q.subject || "Unknown"}|${q.questionText}`;
      return !existingSet.has(identifier);
    });

    if (newQuestions.length === 0) {
      return res.status(409).json({
        success: false,
        message: "All questions in this file are duplicates.",
        skipped: questions.length,
      });
    }

    // 5. Insert only the new unique questions
    const result = await Question.insertMany(newQuestions, { ordered: false });

    res.status(201).json({
      success: true,
      message: `Uploaded ${result.length} new questions. Skipped ${questions.length - result.length} duplicates.`,
      count: result.length,
      skipped: questions.length - result.length,
    });
  } catch (error) {
    // Handle partial errors (if some inserted but others failed)
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate questions found." });
    }

    console.error(error);
    res
      .status(500)
      .json({ error: "Bulk upload failed", details: error.message });
  }
};

// --- GET QUESTIONS (Pagination + Filter + Search) ---
export const getQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      language,
      subject,
      topic,
      subtopic,
      search,
      isUsed,
    } = req.query;

    const query = {};

    // 1. Build Query Object
    if (language) query.language = language;

    // Case-insensitive regex for text fields allows partial matches
    if (subject) query.subject = { $regex: subject, $options: "i" };
    if (topic) query.topic = { $regex: topic, $options: "i" };
    if (subtopic) query.subtopic = { $regex: subtopic, $options: "i" };

    // Search specifically in Question Text
    if (search) {
      query.questionText = { $regex: search, $options: "i" };
    }

    // Boolean Filter for isUsed
    if (isUsed !== undefined && isUsed !== "") {
      query.isUsed = isUsed === "true";
    }

    // 2. Execute Query with Pagination
    const questions = await Question.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      questions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- DELETE QUESTION ---
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // 1. Delete associated media file if it exists
    if (question.mediaUrl) {
      // Assuming mediaUrl is stored like "/uploads/questions/filename.jpg"
      // We need to construct the absolute path on the server
      const relativePath = question.mediaUrl.replace(/^\//, ""); // remove leading slash
      const absolutePath = path.resolve(process.cwd(), relativePath);

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    // 2. Delete from DB
    await question.deleteOne();

    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- GET SINGLE QUESTION BY ID ---
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- UPDATE QUESTION ---
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the existing question
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // 2. Parse text data
    // Note: frontend sends data as a stringified JSON in 'data' field
    let updateData = {};
    if (req.body.data) {
      updateData = JSON.parse(req.body.data);
    }

    // 3. Handle Media Logic
    const removeMedia = req.body.removeMedia === "true"; // Parse boolean string

    if (req.file) {
      // CASE A: New file uploaded (Replace)

      // Delete old file if it exists
      if (question.mediaUrl) {
        const oldPath = path.join(process.cwd(), question.mediaUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Set new file paths
      updateData.mediaUrl = `/uploads/questions/${req.file.filename}`;
      updateData.mediaType = req.file.mimetype;
    } else if (removeMedia) {
      // CASE B: User clicked "Remove Media" (Delete)

      if (question.mediaUrl) {
        const oldPath = path.join(process.cwd(), question.mediaUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      updateData.mediaUrl = null;
      updateData.mediaType = null;
    } else {
      // CASE C: No change to media
      // We don't touch mediaUrl or mediaType in updateData
    }

    // 4. Update the document
    // We use findByIdAndUpdate or manually update fields
    Object.assign(question, updateData);

    await question.save();

    res
      .status(200)
      .json({ success: true, message: "Question updated", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
