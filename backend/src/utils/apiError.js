/**
 * utils/apiError.js
 * Custom error class for API errors
 */

export class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
    }
}
