import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  avatar: Joi.string().uri().optional()
});