const GalleryImage = require('../models/GalleryImage');
const Business = require('../models/Business');
const { sendSuccess, sendError } = require('../utils/response');
const { deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get gallery for owner's business
// @route   GET /api/gallery
// @access  Private
const getGallery = async (req, res) => {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) return sendError(res, 'Business not found', 404);

    const images = await GalleryImage.find({ business: business._id }).sort({ displayOrder: 1 });
    return sendSuccess(res, 'Gallery fetched', { images });
};

// @desc    Upload gallery images
// @route   POST /api/gallery
// @access  Private
const uploadGalleryImages = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return sendError(res, 'No files uploaded', 400);
    }

    const business = await Business.findOne({ owner: req.user._id });
    if (!business) return sendError(res, 'Business not found', 404);

    // Check plan limits
    const existingCount = await GalleryImage.countDocuments({ business: business._id });
    const plan = business.subscription?.plan || 'FREE';
    const maxImages = plan === 'FREE' ? 5 : plan === 'STARTER' ? 20 : 50;

    if (existingCount + req.files.length > maxImages) {
        return sendError(
            res,
            `Your plan allows maximum ${maxImages} gallery images. You have ${existingCount} already.`,
            400
        );
    }

    const images = await Promise.all(
        req.files.map((file, idx) =>
            GalleryImage.create({
                business: business._id,
                url: file.path,
                publicId: file.filename,
                displayOrder: existingCount + idx,
            })
        )
    );

    return sendSuccess(res, 'Images uploaded', { images }, 201);
};

// @desc    Update gallery image caption / order
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryImage = async (req, res) => {
    const image = await GalleryImage.findById(req.params.id).populate('business');
    if (!image) return sendError(res, 'Image not found', 404);
    if (image.business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    const { caption, displayOrder } = req.body;
    if (caption !== undefined) image.caption = caption;
    if (displayOrder !== undefined) image.displayOrder = displayOrder;
    await image.save();

    return sendSuccess(res, 'Image updated', { image });
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryImage = async (req, res) => {
    const image = await GalleryImage.findById(req.params.id).populate('business');
    if (!image) return sendError(res, 'Image not found', 404);
    if (image.business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    await deleteFromCloudinary(image.publicId);
    await image.deleteOne();

    return sendSuccess(res, 'Image deleted');
};

module.exports = { getGallery, uploadGalleryImages, updateGalleryImage, deleteGalleryImage };
