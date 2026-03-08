import Joi from "joi";

/*
Create doctor validation
*/
export const createDoctorSchema = Joi.object({
userId: Joi.string().required(),
licenseNumber: Joi.string().required(),
experienceYears: Joi.number().min(0),
bio: Joi.string().allow("")
});

/*
Update doctor profile
*/
export const updateDoctorSchema = Joi.object({
bio: Joi.string(),
experienceYears: Joi.number().min(0),
languages: Joi.array().items(Joi.string())
});