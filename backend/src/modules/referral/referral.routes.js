import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import validate from "../../middlewares/validator.middleware.js"

import {
  generateReferralCodeController,
  applyReferralController,
  getMyReferralsController
} from "./referral.controller.js"

import { applyReferralValidator } from "./referral.validator.js"

const router = express.Router()

router.get(
  "/my-code",
  authMiddleware,
  generateReferralCodeController
)

router.post(
  "/apply",
  authMiddleware,
  validate(applyReferralValidator),
  applyReferralController
)

router.get(
  "/my-referrals",
  authMiddleware,
  getMyReferralsController
)

export default router