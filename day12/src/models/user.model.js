const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email:{
        type: String,
        unique:true, 
    },
    password:String,
})

// ensure DB-level unique index
userSchema.index({ email: 1 }, { unique: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;