const pool = require("../db/client");
const redis = require("../redis/client");

const CHECK_TIMEOUT_MS = 2000;

// Reject if a check takes too long.
function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
    ]);
}

async function checkRedis() {
    try {
        return (await withTimeout(redis.ping(), CHECK_TIMEOUT_MS)) === "PONG";
    } catch (error) {
        console.error("[health] redis check failed:", error.message);
        return false;
    }
}

async function checkPostgres() {
    try {
        await withTimeout(pool.query("SELECT 1"), CHECK_TIMEOUT_MS);
        return true;
    } catch (error) {
        console.error("[health] postgres check failed:", error.message);
        return false;
    }
}

async function healthCheck(req, res) {
    const [redisUp, postgresUp] = await Promise.all([checkRedis(), checkPostgres()]);
    const healthy = redisUp && postgresUp;

    res.status(healthy ? 200 : 503).json({
        status: healthy ? "ok" : "degraded",
        redis: redisUp ? "up" : "down",
        postgres: postgresUp ? "up" : "down",
        timestamp: new Date().toISOString(),
    });
}

async function getProducts(req, res) {
    try {
        const result = await pool.query(
            "SELECT id, name, total_stock, created_at FROM products ORDER BY created_at"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getProductById(req, res) {
    try {
        const result = await pool.query(
            "SELECT id, name, total_stock, created_at FROM products WHERE id = $1",
            [req.params.productId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Failed to fetch product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    healthCheck,
    checkRedis,
    checkPostgres,
    getProducts,
    getProductById,
};
