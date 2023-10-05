const express = require("express");
const { createCategory, viewsCategory, updateCategory, deleteCategory, filterByCategory } = require("../Controllers/categoryController");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth")

router.post('/', isAdmin, createCategory);



router.put("/:id", isAdmin, updateCategory);
router.delete("/:id", isAdmin, deleteCategory);

router.get("/", filterByCategory);
router.get("/views", authMiddleware, viewsCategory);

module.exports = router
