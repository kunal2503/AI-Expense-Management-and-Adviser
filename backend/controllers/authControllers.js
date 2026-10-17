const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (userId) => jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);

const publicUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email
});

const signup = async (req,res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message : "Please fill all the fields"});
        }
        if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid signup details" });
        }
        if (username.trim().length < 2 || username.trim().length > 60) {
            return res.status(400).json({ message: "Name must be between 2 and 60 characters" });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({ message: "Enter a valid email address" });
        }
        if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({ message: "Password must be at least 8 characters and no more than 72 bytes" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const userExists = await User.findOne({ email: normalizedEmail });
        if(userExists){
            return res.status(409).json({message : "An account with this email already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username : username.trim(),
            email : normalizedEmail,
            password : hashedPassword
        })
        await newUser.save();

        res.status(201).json({ token: createToken(newUser._id.toString()), user: publicUser(newUser) });
    } catch(error){
        if (error.code === 11000) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }
        console.error("Signup failed:", error);
        res.status(500).json({message : "Something went wrong"});
    }
}

const signin = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(typeof email !== "string" || typeof password !== "string" || !email || !password){
            return res.status(400).json({message : "Email and Password are required"});
        }
        const userAlreadyExists = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
        if(!userAlreadyExists){
            return res.status(401).json({message : "Invalid email or password"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, userAlreadyExists.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message : "Invalid email or password"});
        }
        res.status(200).json({ token: createToken(userAlreadyExists._id.toString()), user: publicUser(userAlreadyExists) });
    } catch(error){
        console.error("Signin failed:", error);
        res.status(500).json({message : "Something went wrong"});
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User account not found" });
        }
        return res.status(200).json({ user: publicUser(user) });
    } catch (error) {
        console.error("Loading current user failed:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = { signup, signin, getCurrentUser };
