const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof payload === "string" || !payload.id) {
            return res.status(401).json({ message: "Invalid authentication token" });
        }
        req.user = { id: payload.id };
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired authentication token" });
    }
};

module.exports = requireAuth;
