import * as referralService from "./referral.service.js"

import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiResponse } from "../../utils/apiResponse.js"

export const generateReferralCodeController = asyncHandler(async (req, res) => {
  const code = await referralService.generateReferralCode(req.user.userId)
  return ApiResponse.success(res, "Referral code generated successfully", { code })
})

export const applyReferralController = asyncHandler(async (req, res) => {
  const referral = await referralService.applyReferral({
    userId: req.user.userId,
    code: req.body.code
  })
  return ApiResponse.success(res, "Referral applied successfully", referral)
})

export const getMyReferralsController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const data = await referralService.getMyReferrals(
    req.user.userId,
    Number(page),
    Number(limit)
  )
  return ApiResponse.success(res, "Referrals retrieved successfully", data)
})