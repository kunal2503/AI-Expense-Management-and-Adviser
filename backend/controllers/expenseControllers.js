const Expense = require("../model/expense");


const createExpense = async (req, res) =>{
    try{
        const { amount, description, category, date, userId, paymentMethod} = req.body;
        if(!amount || !category || !userId || !paymentMethod){
            return res.status(400).json({message : "All fields are required"});
        }
        const newExpense =  new Expense({
            amount,
            description : description || "",
            category,
            date : date || Date.now(),
            user : userId,
            paymentMethod
        }, {timestamps : true});
        const savedExpense = await newExpense.save();
        res.status(201).json({message : "Expense created successfully", expense : savedExpense});
    } catch(error){
        res.status(500).json({message : "Internal Server Error", error : error.message});
    }
}

const getExpenses = async (req,res) =>{
    try{    
        const { userId } = req.params;
        if(!userId){
            return res.status(400).json({message : "User ID is required"});
        }
        const userExpenses = await Expense.find({user : UserId}).sort({date : -1});
        if(!userExpenses || userExpenses.length === 0){
            return res.status(404).json({message : "No expenses found for the user"});
        }
        res.status(200).json({message : "Expenses fetched successfully", expenses : userExpenses});
    } catch(error){
        console.log(error);
        res.status(500).json({message : "Internal Server Error", error : error.message});
    }
}

const deleteExpense =  async (req, res) => {
    try{
        const {expenseId} = req.params;
        if(!expenseId){
            return res.status(400).json({message : "Expense ID required"});
        }
        const 
    } catch(error){
        res.status(500).json({message  :"Internal Server Error", error : error});
    }
}
