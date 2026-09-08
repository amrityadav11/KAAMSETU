const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createBusiness,
    getMyBusiness,
    updateBusiness,
    uploadLogo,
    uploadCover,
    publishBusiness,
    getPublicBusiness,
    trackWhatsapp,
    trackPhone,
    getBusinesses,
    generateQR,
} = require('../controllers/businessController');
const { protect } = require('../middleware/auth');
const { logoUpload, coverUpload } = require('../config/cloudinary');

const createValidation = [
    body('name').trim().notEmpty().withMessage('Business name is required'),
    body('category').notEmpty().withMessage('Category is required'),
];

// Public routes
router.get('/', getBusinesses);
router.get('/slug/:slug', getPublicBusiness);
router.post('/slug/:slug/track/whatsapp', trackWhatsapp);
router.post('/slug/:slug/track/phone', trackPhone);

// Protected routes
router.use(protect);
router.get('/my', getMyBusiness);
router.post('/', createValidation, createBusiness);
router.put('/:id', updateBusiness);
router.put('/:id/publish', publishBusiness);
router.post('/:id/logo', logoUpload.single('logo'), uploadLogo);
router.post('/:id/cover', coverUpload.single('cover'), uploadCover);
router.post('/:id/qr', generateQR);

module.exports = router;
