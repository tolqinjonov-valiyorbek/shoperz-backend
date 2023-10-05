const express = require('express');
const multer = require('multer');
const { uploadVideo, uploadImage } = require('../Controllers/uploadController');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/video', upload.single('video'),isAdmin, uploadVideo);
router.post('/image', upload.single('image'),isAdmin, uploadImage);

module.exports = router;
