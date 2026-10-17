process.env.MONGO_URI = "mongodb://127.0.0.1:27017/expense-management-test";
process.env.JWT_SECRET = "a-test-only-secret-with-at-least-32-characters";
process.env.NODE_ENV = "test";
process.env.CLIENT_ORIGIN = "http://localhost:5173";

const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("./index");
const mongoose = require("mongoose");

test("exposes liveness and database readiness separately", async (t) => {
    const server = app.listen(0);
    t.after(() => new Promise((resolve) => server.close(resolve)));
    await new Promise((resolve) => server.once("listening", resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    const liveResponse = await fetch(`${baseUrl}/api/health/live`);
    assert.equal(liveResponse.status, 200);
    assert.deepEqual(await liveResponse.json(), { status: "ok" });
    assert.equal(liveResponse.headers.get("x-content-type-options"), "nosniff");
    assert.equal(liveResponse.headers.get("strict-transport-security"), null);

    const readyResponse = await fetch(`${baseUrl}/api/health/ready`);
    assert.equal(readyResponse.status, mongoose.connection.readyState === 1 ? 200 : 503);
    assert.deepEqual(await readyResponse.json(), {
        status: mongoose.connection.readyState === 1 ? "ok" : "unavailable",
    });
    assert.equal((await fetch(`${baseUrl}/api/health`)).status, 200);
});

test("returns safe client errors for malformed JSON and disallowed origins", async (t) => {
    const server = app.listen(0);
    t.after(() => new Promise((resolve) => server.close(resolve)));
    await new Promise((resolve) => server.once("listening", resolve));
    const baseUrl = `http://127.0.0.1:${server.address().port}`;

    const malformedResponse = await fetch(`${baseUrl}/api/auth/signin`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: '{"email":',
    });
    assert.equal(malformedResponse.status, 400);
    assert.deepEqual(await malformedResponse.json(), { message: "Invalid JSON request body" });

    const originResponse = await fetch(`${baseUrl}/api/health/live`, {
        headers: { origin: "https://attacker.example" },
    });
    assert.equal(originResponse.status, 403);
    assert.deepEqual(await originResponse.json(), { message: "Origin not allowed" });
});

test("limits repeated authentication attempts", async (t) => {
    const server = app.listen(0);
    t.after(() => new Promise((resolve) => server.close(resolve)));
    await new Promise((resolve) => server.once("listening", resolve));
    const url = `http://127.0.0.1:${server.address().port}/api/auth/signin`;
    let response;

    for (let attempt = 0; attempt < 31; attempt += 1) {
        response = await fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: "{}",
        });
    }

    assert.equal(response.status, 429);
    assert.deepEqual(await response.json(), {
        message: "Too many authentication attempts. Please try again later.",
    });
});
