const express = require("express");
const { healthCheck, getProducts, getProductById } = require("./controllers");

const router = express.Router();

router.get("/health", healthCheck);

router.get("/products", getProducts);
router.get("/products/:productId", getProductById);

module.exports = router;