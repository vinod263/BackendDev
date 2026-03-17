import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * Register a new user
 * Validates input, checks for existing user, hashes password, and creates new user
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }


    // Create new user
    const newUser = await userModel.create({
      username,
      email,
      password   // hash password is store with help of userMOdel fmiddleware file
    });

    const savedUser = await newUser.save();
    await sendEmail(
   {  to: email,
     subject: "Welcome to Our App!",
     html: `<h1>Welcome, ${username}!</h1><p>Thank you for registering at our app. We're excited to have you on board!</p>`}
    );


    // // Generate JWT token
    // const token = jwt.sign(
    //   { userId: savedUser._id, email: savedUser.email },
    //   process.env.JWT_SECRET || "your-secret-key",
    //   { expiresIn: "7d" }
    // );

    // Return success response (don't send password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    
      // token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export default {register}