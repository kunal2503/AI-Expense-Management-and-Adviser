const express = require("express");
const { infoBudget, saveBudget } = require("../controllers/budgetControllers");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", infoBudget);
router.put("/", saveBudget);

module.exports = router;
