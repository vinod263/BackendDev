import {Router} from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidator,loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body {username ,email,password}
 */
authRouter.post("/register", registerValidator, authController.register)

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT token
 * @access Public
 * @body {email,password}
 */
authRouter.post("/login",authController.login) 
    
/**
 * @route POST /api/auth/logout
 * @desc Logout user and invalidate JWT token
 * @access Private
 */
authRouter.post("/logout", authUser, authController.logout)

/**
 * @route post /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.get("/get-me", authUser, authController.getMe)
 

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query {token}
 */
authRouter.get("/verify-email", authController.verifyEmail)


export default authRouter;
