import express from "express"

import authMiddleware from "../../middlewares/auth.middleware.js"
import validate from "../../middlewares/validator.middleware.js"

import {
  createOrderController,
  verifyPaymentController,
  getPaymentsController,
  getPaymentByIdController
} from "./payment.controller.js"

import { razorpayWebhook } from "./payment.webhook.js"

import {
  createOrderValidator,
  verifyPaymentValidator
} from "./payment.validator.js"

const router = express.Router()

router.post(
  "/create-order",
  authMiddleware,
  validate(createOrderValidator),
  createOrderController
)

router.post(
  "/verify",
  authMiddleware,
  validate(verifyPaymentValidator),
  verifyPaymentController
)

router.get(
  "/history",
  authMiddleware,
  getPaymentsController
)

router.get(
  "/:id",
  authMiddleware,
  getPaymentByIdController
)

router.post(
  "/webhook",
  express.json({ verify: (req, res, buf) => { req.rawBody = buf } }),
  razorpayWebhook
)

export default router