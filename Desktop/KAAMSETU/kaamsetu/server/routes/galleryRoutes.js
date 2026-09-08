const express = require('express');
const router = express.Router();
const {
    getGallery,
    uploadGalleryImages,
    updateGalleryImage,
    deleteGalleryImage,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { galleryUpload } = require('../config/cloudinary');

router.use(protect);
router.get('/', getGallery);
router.post('/', galleryUpload.array('images', 10), uploadGalleryImages);
router.put('/:id', updateGalleryImage);
router.delete('/:id', deleteGalleryImage);

module.exports = router;
