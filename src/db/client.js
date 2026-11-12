const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  connectionTimeoutMillis: 2000,
});

// Errors on idle clients must be handled or Node crashes.
pool.on("error", (error) => {
  console.error("[postgres] idle client error:", error.message);
});

module.exports = pool;
