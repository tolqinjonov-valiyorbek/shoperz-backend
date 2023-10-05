const express = require("express");
const { createUser, loginUser, views, view, update, deleted, getWishlist } = require("../Controllers/userController");
const { authMiddleware, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);

router.put('/:id', authMiddleware, update);
router.delete('/:id',isAdmin, deleted);
router.get('/wishlist', getWishlist)

router.get('/', views)
router.get('/:id', view)


module.exports = router