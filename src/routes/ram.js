const { createRam, viewsRam, deleteRam, filterByRam } = require("../Controllers/ramController");
const { isAdmin } = require("../middleware/auth");
const router = require("express").Router();

router.post("/",isAdmin, createRam);
router.get("/views", viewsRam);
router.delete("/:id",isAdmin, deleteRam);


router.get('/', filterByRam)
module.exports = router;