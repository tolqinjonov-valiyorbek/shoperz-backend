const router = require("express").Router()
const { authMiddleware } = require("../middleware/auth")
const { addToCart, getUserCart, deleteCart } = require("../Controllers/cartController")

router.post("/create", authMiddleware, addToCart);

router.delete("/delete-product-cart/:cartItemId", authMiddleware, deleteCart);

router.get("/", authMiddleware, getUserCart);
module.exports = router

