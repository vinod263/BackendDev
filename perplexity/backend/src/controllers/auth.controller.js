import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

/**
 * Register a new user
 * Validates input, checks for existing user, creates user, sends verification email
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
    const User = await userModel.create({
      username,
      email,
      password, // hash password is store with help of userMOdel fmiddleware file
    });

    // Generate JWT token
    const emailVerificationToken = jwt.sign(
      {
        email: User.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await sendEmail({
      to: email,
      subject: "Welcome to perplexity! Please verify your email",
      html: `<h1>Welcome, ${username}!,on perplexity AI</h1>
     <p>Thank you for registering at our platform. We're excited to have you on board!</p>
     <p>Please verify your email address by clicking the link below:</p>
     <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
     <p>If you did not register for this account, please ignore this email.</p>
     <p>Best regards,<br/>The Team</p>`,
    });

    // Return success response (don't send password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        userId: User._id,
        username: User.username,
        email: User.email,
      },
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

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}
/**
 * @desc Logout user and invalidate JWT token
 * @route POST /api/auth/logout
 * @access Private
 */
export async function logout(req, res) {
  const token =  req.cookies.token; 
    res.clearCookie("token");
    res.status(200).json({
        message: "Logout successful",
        success: true
    });
}
/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}

/*
  * Verify user's email address 
  * Decodes token, finds user, sets verified to true
  * Returns a simple HTML page confirming verification
*/  
async function verifyEmail(req, res) {
  const { token } = req.query;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    return res.status(404).json({
      message: "invalid token",
      success: false,
      err: "user not found ",
    });
  }

  user.verified = true;
  await user.save();
  res.send(`
 <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px;">
    <h1 style="color: #4CAF50;">Email Verified Successfully!</h1>
    <p style="font-size: 18px; color: #555;">Thank you for verifying your email address. Your account is now active.</p>
    <a href="http://localhost:3000/login" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Go to Login</a>
  </div>
  `);
}



export default { register, verifyEmail, login, getMe ,logout};
