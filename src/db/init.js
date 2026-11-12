// Applies schema.sql. Safe to re-run. Usage: npm run db:init
const fs = require("fs");
const path = require("path");
const pool = require("./client");

async function init() {
    const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await pool.query(sql);
    console.log("Schema applied");
    await pool.end();
}

init().catch(async (error) => {
    console.error("Schema init failed:", error.message);
    await pool.end();
    process.exit(1);
});
