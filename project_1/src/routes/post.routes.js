const express = require('express');
const postController = require('../controllers/post.controller')
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage() });
const identifyUser = require("../middlewares/auth.middleware")
const postRouter = express.Router()
/**
 * @route POST /api/posts/   ==> [protected]  
 *  @description  req.body ={caption,image-file}
 */

postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController)
/**
 *  @route GET /api/posts/ ==>{Protected}
 * @description get all the post created by user that the request come from.
 */
postRouter.get("/", identifyUser, postController.getPostController)
/**
 * @route  GET /api/posts/details/:postId ==>{Protected}
 * @description return an detail about specific post with the id. also check whether the post belong to the user that the request come from  
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)

/**
 * @route  POST /api/posts/like/:postid
 * @description like a post with id provided in the request params.
 */
postRouter.post("/like/:postId", identifyUser, postController.likepostController)


module.exports =postRouter