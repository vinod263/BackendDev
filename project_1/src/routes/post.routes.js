const express = require('express');
const postController = require('../controllers/post.controller')
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage() });
const identifyUser = require("../middlewares/auth.middleware")
const postRouter = express.Router()
/**
 * POST /api/posts/   ==> [protected]  
 *  - req.body ={caption,image-file}
 */

postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController)
/**
 *  GET /api/posts/ ==>{Protected}
 */
postRouter.get("/", identifyUser, postController.getPostController)
/**
 *  GET /api/posts/details/:postId ==>{Protected}
 * -return an detail about specific post with the id. 
 * also check whether the post belong to the user that t
 * he request come from  
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)


module.exports =postRouter