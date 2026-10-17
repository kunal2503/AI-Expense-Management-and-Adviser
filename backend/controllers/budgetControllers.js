const Budget = require("../model/budget");

const infoBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ user: req.user.id, budgetType: "Monthly" });
        return res.status(200).json({ budget });
    } catch (error) {
        console.error("Loading budget failed:", error);
        return res.status(500).json({ message: "Unable to load budget" });
    }
};

const saveBudget = async (req, res) => {
    try {
        const totalBudget = Number(req.body.totalBudget);
        if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
            return res.status(400).json({ message: "Monthly budget must be greater than zero" });
        }
        const budget = await Budget.findOneAndUpdate(
            { user: req.user.id, budgetType: "Monthly" },
            { $set: { totalBudget, budgetType: "Monthly" }, $setOnInsert: { user: req.user.id } },
            { new: true, upsert: true, runValidators: true }
        );
        return res.status(200).json({ budget });
    } catch (error) {
        console.error("Saving budget failed:", error);
        return res.status(500).json({ message: "Unable to save budget" });
    }
};

module.exports = { infoBudget, saveBudget };
