const Lead = require('../models/Lead');
const Business = require('../models/Business');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');
const crypto = require('crypto');

// @desc    Submit an enquiry (public)
// @route   POST /api/leads/enquiry/:slug
// @access  Public
const submitEnquiry = asyncHandler(async (req, res) => {
    const business = await Business.findOne({ slug: req.params.slug, isPublished: true });
    if (!business) return sendError(res, 'Business not found', 404);

    const { name, phone, email, message } = req.body;
    if (!name || !name.trim()) return sendError(res, 'Name is required', 422);
    if (!phone || !phone.trim()) return sendError(res, 'Phone is required', 422);

    const lead = await Lead.create({
        business: business._id,
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim(),
        message: message?.trim(),
        source: 'enquiry_form',
    });

    // Non-blocking analytics
    const ipHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex');
    AnalyticsEvent.create({ business: business._id, type: 'enquiry', ipHash }).catch(() => { });
    Business.findByIdAndUpdate(business._id, { $inc: { enquiryCount: 1 } }).catch(() => { });

    return sendSuccess(res, 'Enquiry submitted. The business will contact you soon.', { lead }, 201);
});

// @desc    Get leads for owner's business
// @route   GET /api/leads
// @access  Private
const getLeads = asyncHandler(async (req, res) => {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) return sendError(res, 'Business not found', 404);

    const { status, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { business: business._id };
    if (status) query.status = status;

    const [leads, total] = await Promise.all([
        Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
        Lead.countDocuments(query),
    ]);

    return sendSuccess(res, 'Leads fetched', {
        leads,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

// @desc    Update lead status
// @route   PUT /api/leads/:id
// @access  Private
const updateLeadStatus = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id).populate('business');
    if (!lead) return sendError(res, 'Lead not found', 404);
    if (lead.business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    const { status, notes } = req.body;
    const validStatuses = ['new', 'contacted', 'converted', 'closed'];
    if (status && !validStatuses.includes(status)) {
        return sendError(res, `Status must be one of: ${validStatuses.join(', ')}`, 422);
    }

    if (status) lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    await lead.save();

    return sendSuccess(res, 'Lead updated', { lead });
});

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id).populate('business');
    if (!lead) return sendError(res, 'Lead not found', 404);
    if (lead.business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    await lead.deleteOne();
    return sendSuccess(res, 'Lead deleted');
});

module.exports = { submitEnquiry, getLeads, updateLeadStatus, deleteLead };
