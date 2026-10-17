const DEVELOPMENT_ORIGIN = "http://localhost:5173";
const JWT_SECRET_PLACEHOLDER = "replace-with-a-random-secret-of-at-least-32-characters";

const parseClientOrigins = (value, isProduction) => {
    const entries = value
        ? value.split(",").map((origin) => origin.trim()).filter(Boolean)
        : isProduction ? [] : [DEVELOPMENT_ORIGIN];

    if (entries.length === 0) {
        throw new Error("CLIENT_ORIGIN must contain at least one allowed origin");
    }

    for (const origin of entries) {
        let parsed;
        try {
            parsed = new URL(origin);
        } catch {
            throw new Error("CLIENT_ORIGIN must contain valid web origins");
        }
        if (
            !["http:", "https:"].includes(parsed.protocol) ||
            (isProduction && parsed.protocol !== "https:") ||
            parsed.origin !== origin ||
            parsed.username ||
            parsed.password ||
            parsed.pathname !== "/" ||
            parsed.search ||
            parsed.hash ||
            (isProduction && ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname))
        ) {
            throw new Error("CLIENT_ORIGIN must contain valid, non-local web origins in production");
        }
    }

    return [...new Set(entries)];
};

const loadConfig = (env = process.env) => {
    const isProduction = env.NODE_ENV === "production";
    if (!env.MONGO_URI) {
        throw new Error("MONGO_URI must be configured");
    }
    if (
        !env.JWT_SECRET ||
        env.JWT_SECRET.length < 32 ||
        env.JWT_SECRET === JWT_SECRET_PLACEHOLDER
    ) {
        throw new Error("JWT_SECRET must be configured with at least 32 non-placeholder characters");
    }

    const port = env.PORT === undefined ? 3000 : Number(env.PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT must be an integer between 1 and 65535");
    }

    let trustProxy;
    if (env.TRUST_PROXY !== undefined && env.TRUST_PROXY !== "") {
        trustProxy = Number(env.TRUST_PROXY);
        if (!Number.isInteger(trustProxy) || trustProxy < 0) {
            throw new Error("TRUST_PROXY must be a non-negative integer");
        }
    }

    return {
        isProduction,
        port,
        trustProxy,
        clientOrigins: parseClientOrigins(env.CLIENT_ORIGIN, isProduction),
    };
};

module.exports = { loadConfig, parseClientOrigins };
