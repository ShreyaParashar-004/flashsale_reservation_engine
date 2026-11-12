require("dotenv").config();
const express = require("express");
const routes = require("./api/routes");
const { healthCheck, checkRedis, checkPostgres } = require("./api/controllers");
const pool = require("./db/client");
const redis = require("./redis/client");

const app = express();

app.use(express.json());
app.get("/health", healthCheck);
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

let server;
let shuttingDown = false;

async function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received, shutting down`);

    const force = setTimeout(() => process.exit(1), 10000);
    force.unref();

    try {
        if (server) await new Promise((resolve) => server.close(resolve));
        await pool.end();
        console.log("PostgreSQL pool closed");
        await redis.quit().catch(() => redis.disconnect());
        console.log("Redis connection closed");
        process.exit(0);
    } catch (error) {
        console.error("Shutdown error:", error.message);
        process.exit(1);
    }
}

async function start() {
    // Fail fast if a dependency is unreachable at boot.
    const [redisUp, postgresUp] = await Promise.all([checkRedis(), checkPostgres()]);
    if (!redisUp || !postgresUp) {
        console.error("Startup aborted: Redis/PostgreSQL unreachable. Is `docker compose up -d` done and .env set?");
        await pool.end();
        redis.disconnect();
        process.exit(1);
    }

    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();
