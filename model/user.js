require("../db/connect");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password : {
        type: String,
        required: true
    },
    tokens: Array
})

module.exports = mongoose.model("user", userSchema);