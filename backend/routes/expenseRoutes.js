const express = require("express");
const { getExpenses, editExpense, createExpense, deleteExpense } = require("../controllers/expenseControllers");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:expenseId", editExpense);
router.delete("/:expenseId", deleteExpense);

module.exports = router;
