const User = require('../models/User');
const Business = require('../models/Business');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const { sendSuccess, sendError } = require('../utils/response');

// @desc    Admin overview stats
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
    const [
        totalUsers,
        totalBusinesses,
        publishedBusinesses,
        paidBusinesses,
        recentPayments,
        recentBusinesses,
    ] = await Promise.all([
        User.countDocuments({ role: 'owner' }),
        Business.countDocuments(),
        Business.countDocuments({ isPublished: true }),
        Business.countDocuments({ 'subscription.plan': { $in: ['STARTER', 'PRO'] } }),
        Payment.find({ status: 'paid' })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email')
            .populate('business', 'name'),
        Business.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('owner', 'name email'),
    ]);

    // Monthly revenue (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueResult = await Payment.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const monthlyRevenue = revenueResult[0]?.total || 0;

    return sendSuccess(res, 'Stats fetched', {
        totalUsers,
        totalBusinesses,
        publishedBusinesses,
        paidBusinesses,
        monthlyRevenue,
        recentPayments,
        recentBusinesses,
    });
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getUsers = async (req, res) => {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    const query = { role: 'owner' };
    if (search) {
        query.$or = [
            { name: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
        ];
    }

    const [users, total] = await Promise.all([
        User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
        User.countDocuments(query),
    ]);

    return sendSuccess(res, 'Users fetched', {
        users,
        pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
};

// @desc    Get all businesses (admin)
// @route   GET /api/admin/businesses
// @access  Admin
const getBusinesses = async (req, res) => {
    const { page = 1, limit = 20, search, category } = req.query;
    const skip = (page - 1) * limit;
    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const [businesses, total] = await Promise.all([
        Business.find(query)
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Business.countDocuments(query),
    ]);

    return sendSuccess(res, 'Businesses fetched', {
        businesses,
        pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
};

// @desc    Suspend/activate business
// @route   PUT /api/admin/businesses/:id/status
// @access  Admin
const updateBusinessStatus = async (req, res) => {
    const { isActive } = req.body;
    const business = await Business.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
    ).populate('owner', 'name email');

    if (!business) return sendError(res, 'Business not found', 404);

    return sendSuccess(
        res,
        `Business ${isActive ? 'activated' : 'suspended'} successfully`,
        { business }
    );
};

// @desc    Delete business
// @route   DELETE /api/admin/businesses/:id
// @access  Admin
const deleteBusiness = async (req, res) => {
    const business = await Business.findById(req.params.id);
    if (!business) return sendError(res, 'Business not found', 404);

    await business.deleteOne();
    return sendSuccess(res, 'Business deleted');
};

// @desc    Get all payments (admin)
// @route   GET /api/admin/payments
// @access  Admin
const getPayments = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
        Payment.find()
            .populate('user', 'name email')
            .populate('business', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Payment.countDocuments(),
    ]);

    return sendSuccess(res, 'Payments fetched', {
        payments,
        pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
};

// @desc    Suspend user
// @route   PUT /api/admin/users/:id/status
// @access  Admin
const updateUserStatus = async (req, res) => {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, `User ${isActive ? 'activated' : 'suspended'}`, { user });
};

module.exports = {
    getStats,
    getUsers,
    getBusinesses,
    updateBusinessStatus,
    deleteBusiness,
    getPayments,
    updateUserStatus,
};
