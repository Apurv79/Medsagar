import { v4 as uuid } from "uuid"

import Referral from "./referral.model.js"
import { REFERRAL_STATUS, REFERRAL_REWARD } from "./referral.constants.js"

import { creditWallet } from "../wallet/wallet.service.js"
import { TRANSACTION_TYPES } from "../wallet/wallet.constants.js"
import eventBus from "../../utils/eventBus.js";

import User from "../user/user.model.js"

export const generateReferralCode = async (userId) => {

  const code = uuid().split("-")[0]

  await User.updateOne(
    { _id: userId },
    { referralCode: code }
  )

  return code
}

export const applyReferral = async ({ userId, code }) => {

  const referrer = await User.findOne({ referralCode: code }).lean()

  if (!referrer) {
    throw new Error("Invalid referral code")
  }

  if (referrer._id.toString() === userId) {
    throw new Error("Cannot refer yourself")
  }

  const existing = await Referral.findOne({
    referredUserId: userId
  })

  if (existing) {
    throw new Error("Referral already applied")
  }

  const referral = await Referral.create({
    referrerId: referrer._id,
    referredUserId: userId,
    code
  })

  return referral
}

export const completeReferral = async (userId) => {

  const referral = await Referral.findOne({
    referredUserId: userId,
    status: REFERRAL_STATUS.PENDING
  })

  if (!referral) return

  referral.status = REFERRAL_STATUS.COMPLETED
  await referral.save()

  await creditWallet({
    userId: referral.referrerId,
    amount: REFERRAL_REWARD,
    type: TRANSACTION_TYPES.REFERRAL_REWARD,
    referenceId: referral._id
  })

  referral.status = REFERRAL_STATUS.REWARDED
  await referral.save()

  // Fetch referee name for notification
  const referee = await User.findById(userId).select("name").lean()

  // Emit Event
  eventBus.emit("referral.rewarded", {
    userId: referral.referrerId,
    reward: REFERRAL_REWARD,
    refereeName: referee?.name || "a friend",
    refereeId: userId
  })

  return referral
}

export const getMyReferrals = async (userId, page = 1, limit = 20) => {

  const skip = (page - 1) * limit

  const referrals = await Referral.find({ referrerId: userId })
    .populate("referredUserId", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  const total = await Referral.countDocuments({ referrerId: userId })

  return {
    referrals,
    total,
    page,
    limit
  }
}