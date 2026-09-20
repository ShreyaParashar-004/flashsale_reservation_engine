const express = require("express");
const { getProducts, getProductById } = require("./controllers");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

router.get("/products", getProducts);
router.get("/products/:productId", getProductById);

module.exports = router;