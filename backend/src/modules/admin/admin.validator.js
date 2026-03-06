import { body } from "express-validator";

export const createUserValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("role").isIn(["DOCTOR", "CLINIC", "ADMIN"]).withMessage("Invalid role")
];

export const resetPasswordValidator = [
    body("userId").isMongoId().withMessage("Valid User ID is required")
];
