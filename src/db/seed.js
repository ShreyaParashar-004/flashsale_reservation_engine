const { randomUUID } = require("crypto");
const pool = require("./client");

async function seed() {
    const productId = randomUUID();

    await pool.query(
        `
    INSERT INTO products (id, name, total_stock)
    VALUES ($1, $2, $3)
    `,
        [productId, "Flash Sale Product", 100]
    );

    console.log("Seeded product:", productId);

    await pool.end();
}

seed().catch(async (error) => {
    console.error("Seed failed:", error);
    await pool.end();
    process.exit(1);
});