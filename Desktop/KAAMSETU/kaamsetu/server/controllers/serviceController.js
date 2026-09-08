const Service = require('../models/Service');
const Business = require('../models/Business');
const { sendSuccess, sendError } = require('../utils/response');
const { deleteFromCloudinary } = require('../config/cloudinary');

const getOwnerBusiness = async (userId) => {
    return Business.findOne({ owner: userId });
};

// @desc    Get services for owner's business
// @route   GET /api/services
// @access  Private
const getServices = async (req, res) => {
    const business = await getOwnerBusiness(req.user._id);
    if (!business) return sendError(res, 'Business not found', 404);

    const services = await Service.find({ business: business._id }).sort({ displayOrder: 1 });
    return sendSuccess(res, 'Services fetched', { services });
};

// @desc    Add a service
// @route   POST /api/services
// @access  Private
const addService = async (req, res) => {
    const business = await getOwnerBusiness(req.user._id);
    if (!business) return sendError(res, 'Business not found', 404);

    const { name, description, price, priceType, displayOrder } = req.body;

    const service = await Service.create({
        business: business._id,
        name,
        description,
        price,
        priceType: priceType || 'fixed',
        displayOrder: displayOrder || 0,
    });

    return sendSuccess(res, 'Service added', { service }, 201);
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
    const service = await Service.findById(req.params.id).populate('business');
    if (!service) return sendError(res, 'Service not found', 404);
    if (service.business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    const { name, description, price, priceType, isActive, displayOrder } = req.body;
    Object.assign(service, { name, description, price, priceType, isActive, displayOrder });
    await service.save();

    return sendSuccess(res, 'Service updated', { service });
};

// @desc    Upload service image
// @route   POST /api/services/:id/image
// @access  Private
const uploadServiceImage = async (req, res) => {
    if (!req.file) return sendError(res, 'No file uploaded', 400);

    const service = await Service.findById(req.params.id).populate('business');
    if (!service) return sendError(res, 'Service not found', 404);
    if (service.business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    if (service.imagePublicId) await deleteFromCloudinary(service.imagePublicId);

    service.image = req.file.path;
    service.imagePublicId = req.file.filename;
    await service.save();

    return sendSuccess(res, 'Image uploaded', { image: service.image });
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
    const service = await Service.findById(req.params.id).populate('business');
    if (!service) return sendError(res, 'Service not found', 404);
    if (service.business.owner.toString() !== req.user._id.toString()) {
        return sendError(res, 'Not authorized', 403);
    }

    if (service.imagePublicId) await deleteFromCloudinary(service.imagePublicId);
    await service.deleteOne();

    return sendSuccess(res, 'Service deleted');
};

module.exports = { getServices, addService, updateService, uploadServiceImage, deleteService };
