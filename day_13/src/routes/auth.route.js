const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authRouter = express.Router();
/** * /api/auth/register
 */
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUseralready = await userModel.findOne({ email });

  if (isUseralready) {
    return res.status(409).json({
      message: "User Already Exists with this Email Address",
    });
  }

  const hash =  crypto.createHash("md5").update(password).digest("hex");
  const user = await userModel.create({
    email,
    name,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token, {
    httpOnly: true,
  });

  res.status(201).json({
    message: "user registered successfully",
    user,
    token,
  });
});

authRouter.post("/protected", async (req, res) => {
  console.log(req.cookies);

  res.status(200).json({
    message: "you have accessed the protected route",
  });
});

/**
 * /api/auth/login
 *
 * controller function to handle user login
 * 1. get email and password from req.body
 * 2. check if user with the email exists in the database
 * 3. if user does not exist, return 404 with message "User Not Found"
 * 4. if user exists, compare the password with the password in the database
 * 5. if password does not match, return 401 with message "Invalid Credentials"
 * 6. if password matches, create a JWT token with user id and email as payload
 * 7. return 200 with message "Login Successful", user details and token
 *
 */
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }
  
  const hash =  crypto.createHash("md5").update(password).digest("hex");
  const isPasswordMatch = user.password === hash;
  if (!isPasswordMatch) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token", token, {
    httpOnly: true,
  });

  res.status(200).json({
    message: "Login Successful",
    user,
    token,
  });
});

module.exports = authRouter;
