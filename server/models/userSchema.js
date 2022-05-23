
const Mongoose = require("mongoose")

const userSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
})

const userData = new Mongoose.model("User", userSchema)
module.exports = userData;