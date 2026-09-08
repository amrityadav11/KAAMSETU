const express = require('express');
const router = express.Router();
const {
    getServices,
    addService,
    updateService,
    uploadServiceImage,
    deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { serviceImageUpload } = require('../config/cloudinary');

router.use(protect);
router.get('/', getServices);
router.post('/', addService);
router.put('/:id', updateService);
router.post('/:id/image', serviceImageUpload.single('image'), uploadServiceImage);
router.delete('/:id', deleteService);

module.exports = router;
