import fs from "fs";
import path from "path";

const ensureUploadDirs = () => {
  const uploadPath = path.join(process.cwd(), "uploads", "questions");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log("Created folder:", uploadPath);
  }
};

export default ensureUploadDirs;
