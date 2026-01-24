import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import questionRoutes from "./routes/questionRoutes.js";
import ensureUploadDirs from "./utils/ensureUploadDirs.js";

dotenv.config();
ensureUploadDirs();

const app = express();

app.use(cors());

//INCREASE PAYLOAD LIMIT HERE
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/api/admin/questions", questionRoutes);

// Connect to MongoDB Atlas using _MAIN
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed: :", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
