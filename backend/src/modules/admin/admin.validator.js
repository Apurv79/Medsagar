import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("DOCTOR", "CLINIC", "ADMIN").required()
});

export const adminResetPasswordSchema = Joi.object({
    userId: Joi.string().hex().length(24).required() // Simple MongoID check
});
