const pool = require("./client");

async function seed() {
    // Fixed id so re-running the seed never creates duplicates.
    const productId = "11111111-1111-4111-8111-111111111111";

    await pool.query(
        `
    INSERT INTO products (id, name, total_stock)
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO NOTHING
    `,
        [productId, "Flash Sale Product", 100]
    );

    console.log("Product ready:", productId);

    await pool.end();
}

seed().catch(async (error) => {
    console.error("Seed failed:", error);
    await pool.end();
    process.exit(1);
});