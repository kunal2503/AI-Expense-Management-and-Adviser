const test = require("node:test");
const assert = require("node:assert/strict");
const { loadConfig, parseClientOrigins } = require("./config");

const validEnv = {
    MONGO_URI: "mongodb://localhost:27017/expense-management",
    JWT_SECRET: "a-production-secret-with-at-least-32-characters",
    NODE_ENV: "production",
    CLIENT_ORIGIN: "https://pennywise.example.com",
};

test("loads valid production configuration", () => {
    assert.deepEqual(loadConfig(validEnv), {
        isProduction: true,
        port: 3000,
        trustProxy: undefined,
        clientOrigins: ["https://pennywise.example.com"],
    });
});

test("requires explicit non-local client origins in production", () => {
    assert.throws(() => loadConfig({ ...validEnv, CLIENT_ORIGIN: undefined }), /CLIENT_ORIGIN/);
    assert.throws(() => parseClientOrigins("http://localhost:5173", true), /non-local/);
    assert.throws(() => parseClientOrigins("http://pennywise.example.com", true), /valid/);
});

test("rejects malformed origins and unsafe ports", () => {
    assert.throws(() => parseClientOrigins("https://example.com/path", false), /valid/);
    assert.throws(() => loadConfig({ ...validEnv, PORT: "70000" }), /PORT/);
});

test("requires a database and a sufficiently long JWT secret", () => {
    assert.throws(() => loadConfig({ ...validEnv, MONGO_URI: "" }), /MONGO_URI/);
    assert.throws(() => loadConfig({ ...validEnv, JWT_SECRET: "short" }), /JWT_SECRET/);
});

test("uses a local origin by default outside production", () => {
    assert.deepEqual(parseClientOrigins(undefined, false), ["http://localhost:5173"]);
});
