const pool = require("../db/client");

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
    getProducts,
    getProductById,
};
