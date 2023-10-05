const { createProcessor, viewsProcessor, updateProcessor, deleteProcessor, filterByProcessor } = require("../Controllers/processorController");
const { authMiddleware, isAdmin } = require("../middleware/auth")
const router = require("express").Router();

router.post("/", isAdmin, createProcessor);
router.get("/views", viewsProcessor);
router.get("/", filterByProcessor)
router.put("/:id",isAdmin, updateProcessor);
router.delete("/:id", isAdmin, deleteProcessor);

module.exports = router;