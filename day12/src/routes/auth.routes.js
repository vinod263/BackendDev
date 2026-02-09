const express = require('express');
const UserModel = require('../models/user.model');

const authRouter = express.Router();

authRouter.post("/register",async (req,res)=>{
  const {email,name,password} =req.body;

 const user = await UserModel.create({
    email,password,name
  })

  res.json({
    message : "user register succecfully",
    user
  })

})


module.exports = authRouter;