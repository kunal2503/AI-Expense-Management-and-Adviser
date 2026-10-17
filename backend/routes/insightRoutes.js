const express = require("express");
const { askQuestion } = require("../controllers/insightControllers");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.post("/chat", askQuestion);

module.exports = router;
