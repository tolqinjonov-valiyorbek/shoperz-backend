const express = require("express")
const {  postComment, editComment, deleteComment } = require("../Controllers/commentController")
const router = express.Router()
const { authMiddleware } = require("../middleware/auth")

router.post("/product/:productId/comments", authMiddleware, postComment)
router.put("/:id", authMiddleware, editComment)
router.delete("/:commentId", authMiddleware, deleteComment)

module.exports = router