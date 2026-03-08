import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/reports"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];

  if (!allowed.includes(file.mimetype))
    return cb(new Error("Invalid file type"));

  cb(null, true);
};

export const uploadReport = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});