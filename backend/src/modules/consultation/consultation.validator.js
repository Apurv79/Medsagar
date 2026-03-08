import Joi from "joi";

export const startConsultationValidator = Joi.object({
    appointmentId: Joi.string().required(),
});

export const joinConsultationValidator = Joi.object({
    consultationId: Joi.string().required(),
});

export const endConsultationValidator = Joi.object({
    consultationId: Joi.string().required(),
    summary: Joi.string().allow("", null).optional(),
    prescriptionUrl: Joi.string().allow("", null).optional(),
});
