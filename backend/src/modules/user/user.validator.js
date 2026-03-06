import { body } from "express-validator";

export const updateProfileValidator = [
  body("name").optional().isLength({ min: 2 }),
  body("phone").optional().isMobilePhone()
];