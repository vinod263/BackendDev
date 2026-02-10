const expess = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authRouter = expess.Router();

/**
 * /api/auth/register
 */
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });
  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User ALready Exists with this Email Address",
    });
  }
  const user = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("jwt_token" ,token)
  
  res.status(201).json({
    message: "user registered",
    user,
    token,
  });
});

module.exports = authRouter;
