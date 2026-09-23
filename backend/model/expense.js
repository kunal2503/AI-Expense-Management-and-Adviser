const mongoose = require("mongoose");


const expenseSchema = new mongoose.Schema({
    amount : {
        type : Number,
        required : true,
        min : 1
    },
    description : {
        type : String,
    },
    category : {
        type : String,
        enum : ["Food", "Transportation", "Entertainment", "Healthcare", "Education", "Utilities", "Shopping", "Travel", "Other"],
        required : true,
        default  : "Other"
    },
    date : {
        type : Date,
         required : true,
         default : Date.now
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required :  true,
        ref : "User"
    },
    paymentMethod : {
        type : String,
        required : true,
        enum : ["Cash", "Credit Card", "Debit Card", "UPI"],
    },

}, { timestamps : true});

const Expense = mongoose.model("Expense", expenseSchema);