const express = require("express");
const {getExpense,editExpense, createExpense, deleteExpense} = require("../controllers/expenseControllers");

const router = express.Router();

router.get("/:userId",getExpense);
router.post("/create-expense",createExpense);
router.put("/:expenseId",editExpense);
router.delete("/:expenseId",deleteExpense);


module.exports = router;
