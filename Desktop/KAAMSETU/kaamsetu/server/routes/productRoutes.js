const express = require('express');
const router = express.Router();
const {
    getProducts,
    addProduct,
    updateProduct,
    uploadProductImage,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { serviceImageUpload } = require('../config/cloudinary');

router.use(protect);
router.get('/', getProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct);
router.post('/:id/image', serviceImageUpload.single('image'), uploadProductImage);
router.delete('/:id', deleteProduct);

module.exports = router;
