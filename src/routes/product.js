const express = require("express");
const { createProduct, updateProduct, viewsProduct, viewProduct, deleteProduct, paginations, filterPrice, addToWishlist, search } = require("../Controllers/productController.js");
const { isAdmin } = require("../middleware/auth.js");


const router = express.Router();

router.post('/', isAdmin, createProduct);
router.put('/:id',isAdmin, updateProduct);
router.get('/', viewsProduct);

router.delete('/:id',isAdmin, deleteProduct);


router.get("/get-product", paginations)
router.get("/get-price", filterPrice)


router.post("/wishlist",addToWishlist)

router.get("/search", search);



router.get('/:id', viewProduct);

module.exports = router