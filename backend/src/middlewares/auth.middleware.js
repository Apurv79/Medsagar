import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    logger.info("Authenticated user:", decoded.userId);

    next();
  } catch (error) {
    logger.error("Invalid token:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export default authMiddleware;