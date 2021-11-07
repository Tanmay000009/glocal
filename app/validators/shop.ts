import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const shopValidationRules = () => [
  // username must be an email
  body("email").isEmail().withMessage("Please enter a valid email"),
  // password must be at least 5 chars long
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password should be of minimum length 5"),
  // feedback can only be between 1 & 3
  body("feedback")
    .optional()
    .isLength({ min: 1, max: 3 })
    .withMessage("Feedback can have value: 1 or 2 or 3"),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: Array<Object> = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
