import multer from "multer";
import path from "path";
import fs from "fs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

/*
Ensure upload directories exist
*/
const ensureDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("Created upload directory:", dir);
  }
};

/*
Dynamic storage configuration
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/misc";

    if (file.fieldname === "license") uploadPath = "uploads/doctors/licenses";
    if (file.fieldname === "degree") uploadPath = "uploads/doctors/degrees";
    if (file.fieldname === "profileImage") uploadPath = "uploads/doctors/profile";
    if (file.fieldname === "clinicDoc") uploadPath = "uploads/clinics/docs";

    ensureDirectory(uploadPath);

    console.log("Uploading file to:", uploadPath);

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    const finalName = `${uniqueName}${ext}`;

    console.log("Generated file name:", finalName);

    cb(null, finalName);
  }
});

/*
File type validation
*/
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    console.error("Rejected file type:", ext);
    cb(new Error("Unsupported file type"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

export default upload;