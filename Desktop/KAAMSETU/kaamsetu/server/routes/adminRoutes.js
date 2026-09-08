const express = require('express');
const router = express.Router();
const {
    getStats,
    getUsers,
    getBusinesses,
    updateBusinessStatus,
    deleteBusiness,
    getPayments,
    updateUserStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/businesses', getBusinesses);
router.put('/businesses/:id/status', updateBusinessStatus);
router.delete('/businesses/:id', deleteBusiness);
router.get('/payments', getPayments);

module.exports = router;
