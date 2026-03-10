import Joi from "joi"

export const createOrderValidator = Joi.object({
  amount: Joi.number().positive().required()
})

export const verifyPaymentValidator = Joi.object({
  orderId: Joi.string().required(),
  paymentId: Joi.string().required(),
  signature: Joi.string().required()
})

export const refundValidator = Joi.object({
  paymentId: Joi.string().required(),
  amount: Joi.number().positive().required()
})