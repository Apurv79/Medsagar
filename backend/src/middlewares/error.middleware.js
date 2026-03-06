import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  logger.error("Error:", err.message);

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

export default errorMiddleware;