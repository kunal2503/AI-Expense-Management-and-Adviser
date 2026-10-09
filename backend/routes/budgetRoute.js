const express = require("express");
const {infoBudget, createNewBudget, editBudget, deleteBudget} = require("../controllers/budgetControllers");


const router = express.Router();

router.get(("info-budget/:id"), infoBudget);
router.post(("create-budget"), createNewBudget);
router.put(("update-budget/:id"), editBudget);
router.delete(("delete-budget/:id"), deleteBudget);

module.exports = router;
