const userModel = require("../models/user.model");
const followModel = require("../models/follow.model");

async function followUserController(req, res) {
  try {
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    if (followeeUsername == followerUsername) {
      return res.status(400).json({
        message: "You can't follow yourself",
      });
    }

    const isFolloweeExists = await userModel.findOne({
      username: followeeUsername,
    });
    if (!isFolloweeExists) {
      return res.status(400).json({
        message: "User you are try to follow does not exits",
      });
    }
    const isAlreadyFollowing = await followModel.findOne({
      follower: followerUsername,
      followee: followeeUsername,
    });
    if (isAlreadyFollowing) {
      return res.status(200).json({
        message: `You are already following ${followeeUsername}`,
        follow: isAlreadyFollowing,
      });
    }
    const followRecord = await followModel.create({
      follower: followerUsername,
      followee: followeeUsername,
    });
    res.status(201).json({
      messagee: `follow request send to ${followeeUsername}`,
      follow: followRecord,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}
async function getPendingFollowRequests(req, res) {
  try {
    const followeeUsername = req.user.username; // logged-in user

    const pendingRequests = await followModel.find({
      followee: followeeUsername,
      status: "pending",
    });

    res.status(200).json({
      message: "Pending follow requests fetched successfully.",
      requests: pendingRequests,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}
async function acceptFollowRequest(req, res) {
  try {
    const followerUsername = req.params.username; //send request
    const followeeUsername = req.user.username; //come request

    const follow = await followModel.findOneAndUpdate(
      { follower: followerUsername, followee: followeeUsername }, // filter
      { status: "accepted" }, // update
      { returnDocument: "after" }, // ✅ replaces { new: true }
    );

    if (!follow) {
      return res.status(404).json({ message: "Follow request not found." });
    }

    res.status(200).json({ message: "Follow request accepted.", follow });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}
async function rejectFollowRequest(req, res) {
  try {
     const followerUsername = req.params.username; //send request
    const followeeUsername = req.user.username; //come request

    const follow = await followModel.findOneAndDelete(
     { follower: followerUsername, followee: followeeUsername }, // filter
      { status: "rejected" },
      { returnDocument: "after" }
    );

    if (!follow) {
      return res.status(404).json({ message: "Follow request not found." });
    }

    res.status(200).json({ message: "Follow request rejected.", follow });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
}
async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });
  if (!isUserFollowing) {
    return res.status(200).json({
      message: `You are not following ${followeeUsername}`,
    });
  }

  await followModel.findByIdAndDelete(isUserFollowing._id);

  res.status(200).json({
    message: `You have Unfollowed ${followeeUsername}`,
  });
}

module.exports = {
  followUserController,
  getPendingFollowRequests,
  acceptFollowRequest,
  rejectFollowRequest,
  unfollowUserController,
};
