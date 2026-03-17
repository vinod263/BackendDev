import {Router} from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidationRules, handleValidationErrors } from "../validators/auth.validator.js";

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {username ,email,password}
 */
authRouter.post("/register", registerValidationRules(), handleValidationErrors, authController.register)



export default authRouter;
