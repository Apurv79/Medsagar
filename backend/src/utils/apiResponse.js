/**
 * utils/apiResponse.js
 * Standard response structure
 */

export class ApiResponse {
  static success(res, message, data = null, meta = {}, status = 200) {
    const defaultMeta = {
      timestamp: new Date().toISOString()
    };
    return res.status(status).json({
      success: true,
      message,
      data,
      meta: { ...defaultMeta, ...meta }
    });
  }

  static error(res, message, status = 500) {
    return res.status(status).json({
      success: false,
      message
    });
  }
}

export default ApiResponse;