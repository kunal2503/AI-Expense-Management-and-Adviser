const mongoose = require("mongoose");


const budgetSchema = new mongoose.Schema({
    totalBudget : {
        type : Number,
        required : true,
        min :0
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref  : "User"
    },
    spentAmount : {
        type : Number,
        default : 0
    },
    date : {
        type : Date,
        required : true,
        default : Date.now
    }
},{ timestamps : true});

const Budget = mongoose.model("Budget", budgetSchema);