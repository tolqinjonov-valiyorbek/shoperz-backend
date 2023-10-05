const { createOrder, viewOrder } = require("../Controllers/orderController");
const { authMiddleware } = require("../middleware/auth");

const router = require("express").Router();

router.post("/create-order", authMiddleware, createOrder);
router.get('/:id', viewOrder);

module.exports = router;