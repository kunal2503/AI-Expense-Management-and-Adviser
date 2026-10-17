const { answerExpenseQuestion } = require("../services/expenseAdviser");

const askQuestion = async (req, res) => {
    const { question } = req.body;
    if (typeof question !== "string" || !question.trim() || question.trim().length > 500) {
        return res.status(400).json({ message: "Ask a question between 1 and 500 characters" });
    }
    try {
        const result = await answerExpenseQuestion(req.user.id, question.trim());
        return res.status(200).json(result);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        console.error("Generating expense insight failed:", error);
        return res.status(500).json({ message: "Unable to generate an insight right now" });
    }
};

module.exports = { askQuestion };
