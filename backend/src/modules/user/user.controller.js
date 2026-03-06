import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

import * as userService from "./user.service.js";

/* GET PROFILE */

export const getProfile = asyncHandler(async (req, res) => {

  const user = await userService.getUserById(req.user.userId);

  return ApiResponse.success(res, "Profile fetched", user);
});

/* UPDATE PROFILE */

export const updateProfile = asyncHandler(async (req, res) => {

  await userService.updateProfile(req.user.userId, req.body);

  return ApiResponse.success(res, "Profile updated");
});

/* LIST USERS */

export const listUsers = asyncHandler(async (req, res) => {

  const result = await userService.listUsers(req.query);

  return ApiResponse.success(res, "Users fetched", result);
});

/* SEARCH USERS */

export const searchUsers = asyncHandler(async (req, res) => {

  const users = await userService.searchUsers(req.query);

  return ApiResponse.success(res, "Search results", users);
});

/* ACTIVATE USER */

export const activateUser = asyncHandler(async (req, res) => {

  await userService.activateUser(req.params.id);

  return ApiResponse.success(res, "User activated");
});

/* DEACTIVATE USER */

export const deactivateUser = asyncHandler(async (req, res) => {

  await userService.deactivateUser(req.params.id);

  return ApiResponse.success(res, "User deactivated");
});