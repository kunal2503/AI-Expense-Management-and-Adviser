const mongoose = require("mongoose");

const connectDB = async () => {
    try { 
        await mongoose.connect("mongodb://localhost:27017/expense-management");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Not Connected", error);
    }

}

module.exports = connectDB;