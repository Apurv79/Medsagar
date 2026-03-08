import * as service from "./chat.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";

export const getChatHistory = asyncHandler(async (req, res) => {
  const { limit, cursor } = req.query;

  const data = await service.getChatHistory(
    req.params.consultationId,
    parseInt(limit),
    cursor
  );

  res.json(new ApiResponse(200, data));
});