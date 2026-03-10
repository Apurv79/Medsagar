import Razorpay from "razorpay"
import crypto from "crypto"
import { v4 as uuid } from "uuid"

import Payment from "./payment.model.js"
import { PAYMENT_STATUS } from "./payment.constants.js"

import { creditWallet } from "../wallet/wallet.service.js"
import { TRANSACTION_TYPES } from "../wallet/wallet.constants.js"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const createOrder = async (userId, amount) => {

  const receipt = uuid()

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt
  })

  await Payment.create({
    userId,
    orderId: order.id,
    amount,
    receipt
  })

  return order
}

export const verifyPayment = async ({
  userId,
  orderId,
  paymentId,
  signature
}) => {

  const body = orderId + "|" + paymentId

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex")

  if (expected !== signature) {
    throw new Error("Invalid payment signature")
  }

  const payment = await Payment.findOne({ orderId })

  if (!payment) {
    throw new Error("Payment not found")
  }

  if (payment.status === PAYMENT_STATUS.CAPTURED) {
    throw new Error("Payment already captured")
  }

  payment.paymentId = paymentId
  payment.status = PAYMENT_STATUS.CAPTURED
  await payment.save()

  await creditWallet({
    userId,
    amount: payment.amount,
    type: TRANSACTION_TYPES.WALLET_TOPUP,
    referenceId: paymentId
  })

  return payment
}

export const processWebhook = async (body, rawBody, signature) => {

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex")

  if (expected !== signature) {
    throw new Error("Invalid webhook signature")
  }

  const event = body.event

  if (event === "payment.captured") {

    const paymentEntity = body.payload.payment.entity

    const payment = await Payment.findOne({
      orderId: paymentEntity.order_id
    })

    if (!payment) return

    if (payment.status === PAYMENT_STATUS.CAPTURED) return

    payment.status = PAYMENT_STATUS.CAPTURED
    payment.paymentId = paymentEntity.id

    await payment.save()

    await creditWallet({
      userId: payment.userId,
      amount: payment.amount,
      type: TRANSACTION_TYPES.WALLET_TOPUP,
      referenceId: paymentEntity.id
    })
  }

  if (event === "payment.failed") {

    const paymentEntity = body.payload.payment.entity

    await Payment.updateOne(
      { orderId: paymentEntity.order_id },
      { status: PAYMENT_STATUS.FAILED }
    )
  }
}

export const getPayments = async (userId, page = 1, limit = 20) => {

  const skip = (page - 1) * limit

  const payments = await Payment.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  const total = await Payment.countDocuments({ userId })

  return {
    payments,
    total,
    page,
    limit
  }
}

export const getPaymentById = async (paymentId, userId) => {

  return Payment.findOne({
    _id: paymentId,
    userId
  }).lean()
}