import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const userValidationRules = () => [
  // username must be an email
  body("email").isEmail().withMessage("Please enter a valid email"),
  // password must be at least 5 chars long
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password should be of minimum length 5"),
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
