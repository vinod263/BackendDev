const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

async function registerController(req, res)  {
  const { email, username, password, bio, profileImage } = req.body;
  /**
   * check in DB for user register or not
   */
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    const conflictField =
      isUserAlreadyExists.email === email ? "email" : "username";
    return res.status(409).json({
      message: `User already exists — ${conflictField} already taken`,
    });
  }
  /**
   * 1. hash Password
   */
  const hash = await bcrypt.hash(password,10)

  /**
   * 2.save data in database
   */
  const user = await userModel.create({
    username,
    email,
    password: hash,
    bio,
    profileImage,
  });
  /**
   * 3. create token with jwt.sign()
   */
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  /**
   * 4.save token in Browser cookie
   */
  res.cookie("token", token);

  /**
   * 5.send response
   */
  res.status(201).json({
    message: "User register successfully",
    user: {
      name: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });
}

async function  loginController(req, res)  {
  const { email, username, password } = req.body;

  /**
   * username& Password;
   * Email & password;
   */
  const user = await userModel.findOne({
    $or: [
        { username: username }, 
        { email: email }],
  });

  if (!user) {
    return res.status(409).json({
      message: "User not found",
    });
  }


 
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if(!isPasswordValid){
        return res.status(401).json({
            message:"password invalid"
        })
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "User logedin successfully",
    user: {
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
    },
  });


}

module.exports = { 
    registerController,
    loginController
}