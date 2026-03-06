/**
 * User service
 * Handles all DB operations
 */

import User from "./user.model.js";
import logger from "../../utils/logger.js";
import { pagination } from "../../utils/pagination.js";

/* ================= GET PROFILE ================= */

export const getUserById = async (userId) => {

  const user = await User.findById(userId)
    .select("-password")
    .lean();

  return user;
};

/* ================= UPDATE PROFILE ================= */

export const updateProfile = async (userId, payload) => {

  await User.updateOne(
    { _id: userId },
    payload
  );

  logger.info("Profile updated:", userId);

  return true;
};

/* ================= LIST USERS ================= */

export const listUsers = async ({ page, limit, role }) => {

  const { skip } = pagination(page, limit);

  const query = {};

  if (role) query.role = role;

  const users = await User.find(query)
    .select("userId name email phone role isActive")
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments(query);

  return {
    users,
    total
  };
};

/* ================= SEARCH USERS ================= */

export const searchUsers = async ({ query, page, limit }) => {

  const { skip } = pagination(page, limit);

  const searchQuery = {
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { phone: { $regex: query, $options: "i" } }
    ]
  };

  const users = await User.find(searchQuery)
    .select("userId name email role")
    .skip(skip)
    .limit(limit)
    .lean();

  return users;
};

/* ================= ACTIVATE USER ================= */

export const activateUser = async (userId) => {

  await User.updateOne(
    { _id: userId },
    { isActive: true }
  );
};

/* ================= DEACTIVATE USER ================= */

export const deactivateUser = async (userId) => {

  await User.updateOne(
    { _id: userId },
    { isActive: false }
  );
};