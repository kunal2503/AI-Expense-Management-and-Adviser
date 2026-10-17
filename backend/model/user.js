const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        trim: true,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password : {
        type : String,
        required : true,
        select: false
    },
    monthlyIncome : {
        type : Number,
        default : 0
    }
},{ timestamps : true});

const User = mongoose.model("User", userSchema);

module.exports = User;