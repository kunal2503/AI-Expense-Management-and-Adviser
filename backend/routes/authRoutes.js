const express = require('express');
const { rateLimit } = require("express-rate-limit");
const { signup, signin, getCurrentUser } = require("../controllers/authControllers");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many authentication attempts. Please try again later." },
});

router.post("/signup", authLimiter, signup);
router.post("/signin", authLimiter, signin);
router.get("/me", requireAuth, getCurrentUser);


module.exports = router;
