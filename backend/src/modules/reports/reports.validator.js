import Joi from "joi";

export const uploadReportValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
});