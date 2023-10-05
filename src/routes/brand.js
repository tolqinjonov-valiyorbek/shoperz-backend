const express = require("express");
const { createBrand, updateBrand, viewsBrand, viewBrand, deleteBrand, filterByBrand } = require("../Controllers/brandController");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth")

router.post("/", isAdmin, createBrand);
router.put("/:id", isAdmin, updateBrand);
router.get("/", filterByBrand);
router.get("/views", authMiddleware, viewsBrand);
router.get("/:id", authMiddleware, viewBrand);
router.delete("/:id", isAdmin, deleteBrand);

module.exports = router;