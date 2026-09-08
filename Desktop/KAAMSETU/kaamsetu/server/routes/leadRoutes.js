const express = require('express');
const router = express.Router();
const {
    submitEnquiry,
    getLeads,
    updateLeadStatus,
    deleteLead,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

// Public — submit enquiry
router.post('/enquiry/:slug', submitEnquiry);

// Protected
router.use(protect);
router.get('/', getLeads);
router.put('/:id', updateLeadStatus);
router.delete('/:id', deleteLead);

module.exports = router;
