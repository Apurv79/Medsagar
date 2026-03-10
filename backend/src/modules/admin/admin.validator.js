import Joi from "joi";

export const configSchema = Joi.object({
    key: Joi.string().required().uppercase(),
    value: Joi.any().required(),
    description: Joi.string().allow("")
});

export const toggleStatusSchema = Joi.object({
    isActive: Joi.boolean().required()
});

export const rejectDoctorSchema = Joi.object({
    reason: Joi.string().required()
});

export const paginationQuerySchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20),
    role: Joi.string(),
    status: Joi.string(),
    isActive: Joi.string().valid("true", "false")
});