import Joi from "joi";

export const sendMessageValidator = Joi.object({
  consultationId: Joi.string().required(),
  receiverId: Joi.string().required(),
  message: Joi.string().allow("").optional(),
  attachmentUrl: Joi.string().optional(),
});