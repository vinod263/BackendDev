const express = require("express");
const userController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")
const userRouter = express.Router();

/**
 * @route POST /api/users/follow/:username
 * @description follow req. send
 * @access Private
 */

userRouter.post('/follow/request/:username',identifyUser,userController.followUserController)

/**
 * @route GET /api/users/follow/pending
 * @description Get all pending follow requests for logged-in user
 * @access Private
 */
userRouter.get("/follow/pending",identifyUser,userController.getPendingFollowRequests);

/**
 * @route POST /api/users/follow/accept/:username
 * @description accecpt/reject follow request / reject
 * @access Private
 */

userRouter.post('/follow/accept/:username',identifyUser,userController.acceptFollowRequest)
userRouter.post('/follow/reject/:username',identifyUser,userController.rejectFollowRequest)

/**
 * @route POST /api/users/unfollow/:username
 * @description unFollow a user
 * @access Private
 */

userRouter.post('/unfollow/:username',identifyUser,userController.unfollowUserController)



module.exports = userRouter;