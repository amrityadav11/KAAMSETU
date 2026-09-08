const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/generateToken');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return sendError(res, 'Email already registered', 409);
    }

    const user = await User.create({ name, email, phone, password });
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return sendSuccess(
        res,
        'Registration successful',
        {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
            },
            token,
        },
        201
    );
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return sendError(res, 'Invalid email or password', 401);
    }

    if (!user.isActive) {
        return sendError(res, 'Your account has been suspended. Contact support.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return sendError(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return sendSuccess(res, 'Login successful', {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
        },
        token,
    });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
    clearTokenCookie(res);
    return sendSuccess(res, 'Logged out successfully');
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, 'User fetched', {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        },
    });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, phone },
        { new: true, runValidators: true }
    );
    return sendSuccess(res, 'Profile updated', {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
        },
    });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return sendError(res, 'Both current and new password are required', 422);
    }
    if (newPassword.length < 8) {
        return sendError(res, 'New password must be at least 8 characters', 422);
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return sendError(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 'Password changed successfully');
});

module.exports = { register, login, logout, getMe, updateProfile, changePassword };
