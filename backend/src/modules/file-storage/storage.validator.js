import Joi from "joi";
import { STORAGE_FOLDERS } from "./storage.constants.js";

export const uploadValidator = Joi.object({
    folder: Joi.string()
        .valid(...Object.values(STORAGE_FOLDERS))
        .default(STORAGE_FOLDERS.REPORTS)
});

export const queryValidator = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20)
});
