const mongoose = require("mongoose");
const Expense = require("../model/expense");

const validateExpenseId = (id) => mongoose.Types.ObjectId.isValid(id);

const createExpense = async (req, res) => {
    try {
        const { amount, description, category, date, paymentMethod } = req.body;
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !category || !paymentMethod) {
            return res.status(400).json({ message: "A positive amount, category, and payment method are required" });
        }

        const expense = await Expense.create({
            amount: numericAmount,
            description: typeof description === "string" ? description.trim() : "",
            category,
            date: date || new Date(),
            user: req.user.id,
            paymentMethod
        });
        return res.status(201).json({ expense });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Creating expense failed:", error);
        return res.status(500).json({ message: "Unable to create expense" });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1, createdAt: -1 });
        return res.status(200).json({ expenses });
    } catch (error) {
        console.error("Loading expenses failed:", error);
        return res.status(500).json({ message: "Unable to load expenses" });
    }
};

const editExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        if (!validateExpenseId(expenseId)) {
            return res.status(400).json({ message: "Invalid expense ID" });
        }
        const updates = {};
        for (const field of ["amount", "description", "category", "date", "paymentMethod"]) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        if (updates.amount !== undefined) {
            updates.amount = Number(updates.amount);
            if (!Number.isFinite(updates.amount) || updates.amount <= 0) {
                return res.status(400).json({ message: "Amount must be greater than zero" });
            }
        }
        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId, user: req.user.id },
            updates,
            { new: true, runValidators: true }
        );
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        return res.status(200).json({ expense });
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Updating expense failed:", error);
        return res.status(500).json({ message: "Unable to update expense" });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        if (!validateExpenseId(expenseId)) {
            return res.status(400).json({ message: "Invalid expense ID" });
        }
        const expense = await Expense.findOneAndDelete({ _id: expenseId, user: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        return res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Deleting expense failed:", error);
        return res.status(500).json({ message: "Unable to delete expense" });
    }
};

module.exports = { createExpense, getExpenses, editExpense, deleteExpense };
