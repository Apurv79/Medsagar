import fs from "fs";
import path from "path";
import logger from "./logger.js";

/*
Delete file utility
Used when validation fails after upload
*/
export const deleteFile = (filePath) => {
  try {
    if (!filePath) return;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted:", filePath);
    }
  } catch (error) {
    logger.error("Error deleting file", error);
  }
};

/*
Resolve absolute file path
*/
export const resolveFilePath = (folder, filename) => {
  try {
    const filePath = path.join("uploads", folder, filename);

    console.log("Resolved file path:", filePath);

    return filePath;
  } catch (error) {
    logger.error("File path resolution failed", error);
    throw error;
  }
};