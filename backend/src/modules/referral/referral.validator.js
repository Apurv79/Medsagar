import Joi from "joi"

export const applyReferralValidator = Joi.object({
  code: Joi.string().required()
})