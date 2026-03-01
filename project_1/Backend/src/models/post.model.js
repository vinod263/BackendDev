const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:"",
    },
    imgUrl: {
        type: String,
        required: [ true, "imgUrl is required for creating an post"]
    },
    imgHash: { type: String, unique: true }, // ✅ correct way
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:[true,"USer id is required for creating an post"]
   }
})

const postModel = mongoose.model("posts",postSchema);

module.exports = postModel;