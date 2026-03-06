/**
 * utils/apiResponse.js
 * Standard response structure
 */

export class ApiResponse {
  static success(res, message, data = null, meta = null, status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
      meta
    });
  }

  static error(res, message, status = 500) {
    return res.status(status).json({
      success: false,
      message
    });
  }
}