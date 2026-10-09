const Budget = require("../model/budget");


const infoBudget = async (req, res) => {
    try{
        const budgetId = req.params.id;
        if(!budgetId){
            return res.status(400).json({message : "Please provide budget id"});
        }
        const budgetExists = await Budget.findById(budgetId);
        if(!budgetExists){
            return res.status(404).json({message : "Budget not Found"});
        }
        res.status(200).json({budget : budgetExists});
    } catch(error){
        console.log(error);
        res.status(500).json({message : "Something went wrong"});
    }
}

const createNewBudget = async (req,res) =>{
    try{
        const {totalBudget, budgetType, userId} = req.body;
        if(!totalBudget || !budgetType || !userId){
            return res.status(400).json({message : "Please provide all required fields"});
        }
        const newBudget = new Budget({
            totalBudget,
            budgetType,
            user : userId
        }, {timestamps : true});
        if(!newBudget){
            return res.status(400).json({message : "Budget not created"});
        }
        await newBudget.save();
        res.status(201).json({message : "Budget created successfully", budget : newBudget});
    } catch(error){
        console.log(error);
        res.status(500).json({message : "Something went wrong"});
    }
}

const editBudget = async (req, res) =>{
    try{
        const budgetId =  req.params.id;
        if(!budgetId){
            return res.status(400).json({message : "Please provide budget id"});
        }
        const budgetExists = await Budget.findById(budgetId);
        if(!budgetExists){
            return res.status(404).json({message : "Budget not Found"});
        }
        const {totalBudget, budgetType, userId, spentAmount} = req.body;
        if(!totalBudget || !budgetType || !userId){
            return res.status(400).json({message : "Please provide all required fields"});
        }
        const updatedBudget =  await Budget.findByIdAndUpdate(budgetId, {
            totalBudget,
            budgetType,
            user : userId,
            spentAmount
        }, {new : true});
        if(!updatedBudget){
            return res.status(400).json({message : "Budget not updated"});
        }
        res.status(200).json({message : "Budget updated successfully", budget : updatedBudget});
    } catch(error){
        console.log(error);
        res.status(500).json({message : "Something went wrong"});
    }
}

const deleteBudget = async (req, res) =>{
    try{
        const budgetId = req.params.id;
        const userId = req.body;
        if(!budgetId){
            return res.status(400).json({message : "Please provide budget id"});
        }
        const budgetExists = await Budget.findById(budgetId);
        if(!budgetExists){
            return res.status(404).json({message : "Budget not Found"});
        }
        if(budgetExists.user.toString() !== userId){
            return res.status(403).json({message : "You are not authorized to delete this budget"});
        }
        const deletedBudget = await Budget.findByIdAndDelete(budgetId);
        if(!deletedBudget){
            return res.status(400).json({message : "Budget not deleted"});
        }
        res.status(200).json({message : "Budget deleted successfully", budget : deletedBudget});
    } catch(error){
        console.log(error);
        res.status(500).json({message : "Something went wrong"});
    }
}


module.exports = {infoBudget, createNewBudget, editBudget, deleteBudget};