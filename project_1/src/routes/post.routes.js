const express = require('express');
const postController = require('../controllers/post.controller')
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage() });

const postRouter = express.Router()
/**
 * POST /api/posts/   ==> [protected]
 *  - req.body ={caption,image-file}
 */

postRouter.post("/",upload.single("image"),postController.createPostController)

/**
 *  /api/posts/
 */
postRouter.get("/",postController.getPostController)


module.exports =postRouter