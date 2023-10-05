const express = require("express");
const { createColor, updateColor, viewsColor, viewColor, deleteColor } = require("../Controllers/colorController");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth")

router.post('/', isAdmin, createColor);
router.put('/:id', isAdmin, updateColor);
router.get('/', authMiddleware, viewsColor);
router.get('/:id', authMiddleware, viewColor);
router.delete('/:id', isAdmin, deleteColor);


module.exports = router;