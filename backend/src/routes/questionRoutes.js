import express from "express";
import multer from "multer";
import {
  uploadQuestion,
  bulkUploadQuestions,
  getQuestions,
  deleteQuestion,
  getQuestionById,
  updateQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/questions");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.get("/", getQuestions);

router.post("/", upload.single("media"), uploadQuestion);

router.post("/bulk", bulkUploadQuestions);

// Routes requiring ID
router.get("/:id", getQuestionById);
router.put("/:id", upload.single("media"), updateQuestion); // PUT for updates
router.delete("/:id", deleteQuestion);

export default router;
