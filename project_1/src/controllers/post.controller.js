const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

async function createPostController(req, res) {
  console.log(req.body, req.file);

  const client = new ImageKit({
    privateKey: process.env["IMAGEKIT_PRIVATE_KEY"], // This is the default and can be omitted
  });

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Token is not provided , Unauthorized access",
    });
  }

  let decoded=null;
  try {
     decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "User not authorized",
    });
  }

  console.log(decoded);

  const file = await client.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: req.file.originalname,
    folder: "/insta_clone",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: decoded.id,
  });
  res.status(201).json({
    message: "post created",
    post,
  });
}



module.exports = {
  createPostController,

};
