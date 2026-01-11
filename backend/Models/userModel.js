const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "agent"],
        default: "user"
    },
 phone: { type: String },
profilePic: { type: String },



},
    { timestamps: true })
const User = mongoose.model('User', userSchema)
module.exports = User