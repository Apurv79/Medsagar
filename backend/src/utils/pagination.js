/**
 * utils/pagination.js
 * Generates pagination params for Mongo queries
 */

export const pagination = (page = 1, limit = 10) => {
  const p = Math.max(parseInt(page), 1);
  const l = Math.max(parseInt(limit), 1);

  return {
    page: p,
    limit: l,
    skip: (p - 1) * l
  };
};