require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const connectDB = require("./DB/connnectDB");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoute");
const insightRoutes = require("./routes/insightRoutes");
const { loadConfig } = require("./config");
const { rateLimit } = require("express-rate-limit");

const app = express();
const config = loadConfig(process.env);

app.disable("x-powered-by");
if (config.trustProxy !== undefined) {
    app.set("trust proxy", config.trustProxy);
}
app.use(helmet(config.isProduction ? {} : { strictTransportSecurity: false }));
app.use(cors({
    origin(origin, callback) {
        if (!origin || config.clientOrigins.includes(origin)) {
            return callback(null, true);
        }
        const error = new Error("Origin is not allowed by CORS");
        error.status = 403;
        return callback(error);
    }
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

app.get("/api/health/live", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.get("/api/health/ready", (req, res) => {
    const ready = mongoose.connection.readyState === 1;
    res.status(ready ? 200 : 503).json({ status: ready ? "ok" : "unavailable" });
});
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

const insightLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many adviser requests. Please try again later." },
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/insights", insightLimiter, insightRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON request body" });
    }
    if (error.type === "entity.too.large") {
        return res.status(413).json({ message: "Request body is too large" });
    }
    if (error.status === 403 && error.message === "Origin is not allowed by CORS") {
        return res.status(403).json({ message: "Origin not allowed" });
    }
    console.error("Unhandled API error:", error);
    return res.status(500).json({ message: "Internal server error" });
});

const start = async () => {
    const { port } = config;
    await connectDB();
    const server = app.listen(port, () => console.log(`API server listening on port ${port}`));
    server.requestTimeout = 60_000;
    server.headersTimeout = 65_000;
    server.keepAliveTimeout = 5_000;

    let shuttingDown = false;
    const shutdown = (signal) => {
        if (shuttingDown) return;
        shuttingDown = true;
        console.log(`${signal} received; shutting down gracefully`);
        const forceExit = setTimeout(() => {
            console.error("Graceful shutdown timed out");
            process.exit(1);
        }, 10_000);
        forceExit.unref();
        server.close(async (error) => {
            try {
                await mongoose.disconnect();
                clearTimeout(forceExit);
                if (error) {
                    console.error("HTTP server shutdown failed:", error);
                    process.exitCode = 1;
                    return;
                }
                console.log("Server shut down successfully");
            } catch (disconnectError) {
                console.error("Database shutdown failed:", disconnectError);
                process.exitCode = 1;
            }
        });
    };
    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
};

if (require.main === module) {
    start().catch((error) => {
        console.error("Failed to start API server:", error);
        process.exitCode = 1;
    });
}

module.exports = app;
