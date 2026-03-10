import * as paymentService from "./payment.service.js"

import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiResponse } from "../../utils/apiResponse.js"

export const createOrderController = asyncHandler(async (req, res) => {
  const order = await paymentService.createOrder(
    req.user.userId,
    req.body.amount
  )
  return ApiResponse.success(res, "Order created successfully", order)
})

export const verifyPaymentController = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyPayment({
    userId: req.user.userId,
    ...req.body
  })
  return ApiResponse.success(res, "Payment verified successfully", payment)
})

export const getPaymentsController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const data = await paymentService.getPayments(
    req.user.userId,
    Number(page),
    Number(limit)
  )
  return ApiResponse.success(res, "Payments retrieved successfully", data)
})

export const getPaymentByIdController = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(
    req.params.id,
    req.user.userId
  )
  return ApiResponse.success(res, "Payment retrieved successfully", payment)
})