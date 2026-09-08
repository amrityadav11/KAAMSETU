const Product = require('../models/Product');
const Business = require('../models/Business');
const { sendSuccess, sendError } = require('../utils/response');
const { deleteFromCloudinary } = require('../config/cloudinary');

const getOwnerBusiness = async (userId) => Business.findOne({ owner: userId });

// @desc    Get products for owner's business
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  const business = await getOwnerBusiness(req.user._id);
  if (!business) return sendError(res, 'Business not found', 404);

  const products = await Product.find({ business: business._id }).sort({ displayOrder: 1 });
  return sendSuccess(res, 'Products fetched', { products });
};

// @desc    Add a product
// @route   POST /api/products
// @access  Private
const addProduct = async (req, res) => {
  const business = await getOwnerBusiness(req.user._id);
  if (!business) return sendError(res, 'Business not found', 404);

  const { name, description, price, discountPrice, category, displayOrder } = req.body;

  const product = await Product.create({
    business: business._id,
    name,
    description,
    price,
    discountPrice,
    category,
    displayOrder: displayOrder || 0,
  });

  return sendSuccess(res, 'Product added', { product }, 201);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('business');
  if (!product) return sendError(res, 'Product not found', 404);
  if (product.business.owner.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized', 403);
  }

  const { name, description, price, discountPrice, category, isAvailable, displayOrder } = req.body;
  Object.assign(product, { name, description, price, discountPrice, category, isAvailable, displayOrder });
  await product.save();

  return sendSuccess(res, 'Product updated', { product });
};

// @desc    Upload product image
// @route   POST /api/products/:id/image
// @access  Private
const uploadProductImage = async (req, res) => {
  if (!req.file) return sendError(res, 'No file uploaded', 400);

  const product = await Product.findById(req.params.id).populate('business');
  if (!product) return sendError(res, 'Product not found', 404);
  if (product.business.owner.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized', 403);
  }

  if (product.imagePublicId) await deleteFromCloudinary(product.imagePublicId);

  product.image = req.file.path;
  product.imagePublicId = req.file.filename;
  await product.save();

  return sendSuccess(res, 'Image uploaded', { image: product.image });
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('business');
  if (!product) return sendError(res, 'Product not found', 404);
  if (product.business.owner.toString() !== req.user._id.toString()) {
    return sendError(res, 'Not authorized', 403);
  }

  if (product.imagePublicId) await deleteFromCloudinary(product.imagePublicId);
  await product.deleteOne();

  return sendSuccess(res, 'Product deleted');
};

module.exports = { getProducts, addProduct, updateProduct, uploadProductImage, deleteProduct };
