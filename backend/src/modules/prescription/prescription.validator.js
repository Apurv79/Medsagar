import Joi from "joi";

export const createPrescriptionValidator = Joi.object({
  consultationId: Joi.string().required(),

  medicines: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      dosage: Joi.string().required(),
      duration: Joi.string().required(),
      instructions: Joi.string().optional(),
    })
  ),

  notes: Joi.string().optional(),
});