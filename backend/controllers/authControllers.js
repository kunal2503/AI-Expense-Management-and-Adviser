const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req,res) => {
    try {
        const {username, email, password} = req.body;
        // console.log("Signup request body: ", req.body);
        if(!username || !email || !password){
            return res.status(400).json({message : "Please fill all the fields"});
        }
        const userExists = await User.findOne({email})
        if(userExists){
            console.log(userExists);
            return res.status(400).json({message : "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username : username,
            email : email,
            password : hashedPassword
        })
        console.log("New user created: ", newUser);
        await newUser.save();

        const token = await jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(201).json({token : token});
    } catch(error){
        console.log(error);
        res.status(500).json({message : "Something went wrong"});
    }
}

const signin = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : "Email and Password are required"});
        }
        const userAlreadyExists = await User.findOne({email});
        if(!userAlreadyExists){
            return res.status(404).json({message : "User not found"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, userAlreadyExists.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Invalid credentials"});
        }


        const token = await jwt.sign({id: userAlreadyExists._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(200).json({token : token});
    } catch(error){
        res.status(500).json({message : "Something went wrong"});
    }
}


module.exports = {signup, signin};