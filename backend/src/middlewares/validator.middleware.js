import logger from "../utils/logger.js";

/**
 * Joi Validator Middleware
 * @param {Object} schema - Joi schema object
 * @param {String} source - Source of data (body, query, params)
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message.replace(/"/g, ""))
        .join(", ");

      logger.error(`Validation error: ${errorMessage}`);

      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    // Replace request data with validated (and stripped) value
    req[source] = value;
    next();
  };
};

export default validate;