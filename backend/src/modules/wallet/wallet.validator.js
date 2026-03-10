import Joi from "joi";

export const creditValidator = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  type: Joi.string().required(),
  referenceId: Joi.string().optional()
});

export const debitValidator = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  type: Joi.string().required(),
  referenceId: Joi.string().optional()
});

export const adminAdjustValidator = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().required(),
  reason: Joi.string().required()
});