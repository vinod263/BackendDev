const crypto =require("crypto");
const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const likeModel = require("../models/like.model");

async function createPostController(req, res) {
  try {
    console.log(req.body, req.file);
    // Step 1: Generate hash of image buffer
    const hash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    // Step 2: Check if hash already exists in DB
    const existingPost = await postModel.findOne({ imgHash: hash });
    if (existingPost) {
      return res.status(400).json({ message: "Duplicate image detected" });
    }

    // Step 3: Upload to ImageKit
    const client = new ImageKit({
      privateKey: process.env["IMAGEKIT_PRIVATE_KEY"], // This is the default and can be omitted
    });

    const file = await client.files.upload({
      file: await toFile(Buffer.from(req.file.buffer), "file"),
      fileName: req.file.originalname,
      folder: "/insta_clone",
    });

    const post = await postModel.create({
      caption: req.body.caption,
      imgUrl: file.url,
      imgHash: hash,
      user: req.user.id,
    });
    res.status(201).json({
      message: "post created",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getPostController(req, res) {
  const userId = req.user.id;
  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "post fatched Successfully",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  console.log(req.user.username);
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "data not found.",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  res.status(200).json({
    message: "Post fetched successfully.",
    post,
  });
}
async function likepostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "post not found.",
    });
  }
  const like = await likeModel.create({
    post: postId,
    user: username,
  });

  res.status(200).json({
    message: "post liked successfully.",
    like,
  });
}
module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likepostController,
};
