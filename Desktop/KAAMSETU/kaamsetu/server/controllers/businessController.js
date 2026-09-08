const QRCode = require('qrcode');
const Business = require('../models/Business');
const Service = require('../models/Service');
const Product = require('../models/Product');
const GalleryImage = require('../models/GalleryImage');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const { sendSuccess, sendError } = require('../utils/response');
const { generateUniqueSlug } = require('../utils/slugify');
const { deleteFromCloudinary } = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');
const crypto = require('crypto');

// @desc    Create a new business
// @route   POST /api/businesses
// @access  Private
const createBusiness = asyncHandler(async (req, res) => {
    // Check if owner already has a business
    const existing = await Business.findOne({ owner: req.user._id });
    if (existing) {
        return sendError(res, 'You already have a business. Please edit your existing business.', 409);
    }

    const { name, category } = req.body;
    if (!name || !category) {
        return sendError(res, 'Business name and category are required', 422);
    }

    const slug = await generateUniqueSlug(name);

    const defaultHours = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ].map((day) => ({
        day,
        isOpen: day !== 'Sunday',
        openTime: '09:00',
        closeTime: '18:00',
    }));

    const business = await Business.create({
        owner: req.user._id,
        name,
        slug,
        category,
        openingHours: defaultHours,
        setupStep: 2,
    });

    return sendSuccess(res, 'Business created', { business }, 201);
});

// @desc    Get owner's business
// @route   GET /api/businesses/my
// @access  Private
const getMyBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
        return sendError(res, 'No business found. Please create one.', 404);
    }
    return sendSuccess(res, 'Business fetched', { business });
});

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private
const updateBusiness = asyncHandler(async (req, res) => {
    let business = await Business.findById(req.params.id);
    if (!business) return sendError(res, 'Business not found', 404);
    if (business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    const allowed = [
        'name', 'category', 'description', 'phone', 'whatsapp', 'whatsappMessage',
        'email', 'website', 'address', 'city', 'state', 'pincode', 'location',
        'openingHours', 'socialLinks', 'setupStep',
    ];
    const updates = {};
    allowed.forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Re-slug if name changed
    if (updates.name && updates.name !== business.name) {
        updates.slug = await generateUniqueSlug(updates.name, business._id);
    }

    business = await Business.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    });

    return sendSuccess(res, 'Business updated', { business });
});

// @desc    Upload logo
// @route   POST /api/businesses/:id/logo
// @access  Private
const uploadLogo = asyncHandler(async (req, res) => {
    if (!req.file) return sendError(res, 'No file uploaded', 400);

    const business = await Business.findById(req.params.id);
    if (!business) return sendError(res, 'Business not found', 404);
    if (business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    if (business.logoPublicId) await deleteFromCloudinary(business.logoPublicId);

    business.logo = req.file.path;
    business.logoPublicId = req.file.filename;
    await business.save();

    return sendSuccess(res, 'Logo uploaded', { logo: business.logo });
});

// @desc    Upload cover image
// @route   POST /api/businesses/:id/cover
// @access  Private
const uploadCover = asyncHandler(async (req, res) => {
    if (!req.file) return sendError(res, 'No file uploaded', 400);

    const business = await Business.findById(req.params.id);
    if (!business) return sendError(res, 'Business not found', 404);
    if (business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    if (business.coverImagePublicId) await deleteFromCloudinary(business.coverImagePublicId);

    business.coverImage = req.file.path;
    business.coverImagePublicId = req.file.filename;
    await business.save();

    return sendSuccess(res, 'Cover image uploaded', { coverImage: business.coverImage });
});

// @desc    Publish business
// @route   PUT /api/businesses/:id/publish
// @access  Private
const publishBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);
    if (!business) return sendError(res, 'Business not found', 404);
    if (business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    if (!business.name || !business.category) {
        return sendError(res, 'Please complete your business setup before publishing', 400);
    }

    const businessUrl = `${process.env.CLIENT_URL}/business/${business.slug}`;
    const qrDataUrl = await QRCode.toDataURL(businessUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#16a34a', light: '#ffffff' },
    });

    business.isPublished = true;
    business.qrCode = qrDataUrl;
    business.setupStep = 9;
    await business.save();

    return sendSuccess(res, 'Business published successfully', { business });
});

// @desc    Get public business by slug
// @route   GET /api/businesses/slug/:slug
// @access  Public
const getPublicBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findOne({
        slug: req.params.slug,
        isPublished: true,
        isActive: true,
    }).lean();

    if (!business) return sendError(res, 'Business not found', 404);

    // Track analytics (non-blocking)
    const ipHash = crypto
        .createHash('sha256')
        .update(req.ip || 'unknown')
        .digest('hex');
    const source = req.query.source;

    AnalyticsEvent.create({
        business: business._id,
        type: source === 'qr' ? 'qr_scan' : 'page_view',
        ipHash,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referrer'),
    }).catch(() => { });

    Business.findByIdAndUpdate(business._id, { $inc: { views: 1 } }).catch(() => { });

    const [services, products, gallery] = await Promise.all([
        Service.find({ business: business._id, isActive: true }).sort({ displayOrder: 1 }).lean(),
        Product.find({ business: business._id, isAvailable: true }).sort({ displayOrder: 1 }).lean(),
        GalleryImage.find({ business: business._id }).sort({ displayOrder: 1 }).lean(),
    ]);

    return sendSuccess(res, 'Business fetched', {
        business: { ...business, services, products, gallery },
    });
});

// @desc    Track WhatsApp click
// @route   POST /api/businesses/slug/:slug/track/whatsapp
// @access  Public
const trackWhatsapp = asyncHandler(async (req, res) => {
    const business = await Business.findOne({ slug: req.params.slug });
    if (!business) return sendError(res, 'Business not found', 404);

    const ipHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex');
    AnalyticsEvent.create({ business: business._id, type: 'whatsapp_click', ipHash }).catch(() => { });
    Business.findByIdAndUpdate(business._id, { $inc: { whatsappClicks: 1 } }).catch(() => { });

    return sendSuccess(res, 'Tracked');
});

// @desc    Track phone click
// @route   POST /api/businesses/slug/:slug/track/phone
// @access  Public
const trackPhone = asyncHandler(async (req, res) => {
    const business = await Business.findOne({ slug: req.params.slug });
    if (!business) return sendError(res, 'Business not found', 404);

    const ipHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex');
    AnalyticsEvent.create({ business: business._id, type: 'phone_click', ipHash }).catch(() => { });
    Business.findByIdAndUpdate(business._id, { $inc: { phoneClicks: 1 } }).catch(() => { });

    return sendSuccess(res, 'Tracked');
});

// @desc    Get all published businesses (public listing)
// @route   GET /api/businesses
// @access  Public
const getBusinesses = asyncHandler(async (req, res) => {
    const { category, city, search, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { isPublished: true, isActive: true };
    if (category) query.category = category;
    if (city) query.city = new RegExp(city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (search) query.$text = { $search: search };

    const [businesses, total] = await Promise.all([
        Business.find(query)
            .select('name slug category city logo coverImage description phone whatsapp views')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .lean(),
        Business.countDocuments(query),
    ]);

    return sendSuccess(res, 'Businesses fetched', {
        businesses,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            limit: parseInt(limit),
        },
    });
});

// @desc    Generate new QR code
// @route   POST /api/businesses/:id/qr
// @access  Private
const generateQR = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);
    if (!business) return sendError(res, 'Business not found', 404);
    if (business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    const businessUrl = `${process.env.CLIENT_URL}/business/${business.slug}`;
    const qrDataUrl = await QRCode.toDataURL(businessUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#16a34a', light: '#ffffff' },
    });

    business.qrCode = qrDataUrl;
    await business.save();

    return sendSuccess(res, 'QR code generated', { qrCode: qrDataUrl });
});

module.exports = {
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
};
