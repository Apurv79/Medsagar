import * as service from "./chat.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const getChatHistory = asyncHandler(async (req, res) => {
  const { limit, cursor } = req.query;

  const data = await service.getChatHistory(
    req.params.consultationId,
    parseInt(limit) || 20,
    cursor
  );
  return ApiResponse.success(res, "Chat history fetched successfully", data);
});