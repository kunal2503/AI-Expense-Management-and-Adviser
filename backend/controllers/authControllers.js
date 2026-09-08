const User = require("../model/user");
const bcrypt = require("bcrypt");

const signup = async (req,res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message : "Please fill all the fields"});
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message : "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username : name,
            email : email,
            password : hashedPassword
        })
        await newUser.save();

        res.status(201).json({message : "User account created successfully"});
    } catch(error){
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

    } catch(error){
        
    }
}


module.exports = {signup, signin};