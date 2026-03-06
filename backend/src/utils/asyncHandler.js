/**
 * utils/asyncHandler.js
 *
 * Eliminates repetitive try/catch in controllers.
 */

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};