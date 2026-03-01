const express = require("express");
const authRouter = express.Router();
const authController = require('../controllers/auth.controller')
const identifyUser = require("../middlewares/auth.middleware")

authRouter.post("/register",authController.registerController );

/**
 * POST /api/auth/login
 */
authRouter.post("/login", authController.loginController);

/**
 * @route GET /api/auth/get-me
 * @description Get the currently logged user's information
 * @acces Private
 */
authRouter.get("/get-me", identifyUser, authController.getMeController)


module.exports = authRouter;
