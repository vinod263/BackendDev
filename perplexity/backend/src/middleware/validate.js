import { validationResult } from "express-validator";

/**
 * Middleware to handle validation errors
 * Returns formatted error response if validation fails
 */
export const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  
  next();
};
