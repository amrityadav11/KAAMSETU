const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const Business = require('../models/Business');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('../middleware/asyncHandler');

const PLAN_PRICES = {
    STARTER: 49900, // ₹499 in paise
    PRO: 99900,     // ₹999 in paise
};

const PLAN_DURATION_DAYS = {
    STARTER: 365,
    PRO: 365,
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { plan } = req.body;
    if (!['STARTER', 'PRO'].includes(plan)) {
        return sendError(res, 'Invalid plan selected', 400);
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET ||
        process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
        return sendError(res, 'Payment gateway is not configured yet. Contact support.', 503);
    }

    const business = await Business.findOne({ owner: req.user._id });
    if (!business) return sendError(res, 'Business not found', 404);

    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = PLAN_PRICES[plan];
    const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        notes: {
            userId: req.user._id.toString(),
            businessId: business._id.toString(),
            plan,
        },
    });

    const payment = await Payment.create({
        user: req.user._id,
        business: business._id,
        razorpayOrderId: order.id,
        amount: amount / 100,
        currency: 'INR',
        plan,
        status: 'created',
    });

    return sendSuccess(res, 'Order created', {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        paymentId: payment._id,
        businessName: business.name,
        plan,
    });
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
        return sendError(res, 'Missing payment verification details', 400);
    }

    // Verify HMAC signature — critical security check
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        await Payment.findByIdAndUpdate(paymentId, { status: 'failed' });
        return sendError(res, 'Payment verification failed. Signature mismatch.', 400);
    }

    // Confirm the payment record belongs to this user
    const payment = await Payment.findOne({ _id: paymentId, user: req.user._id });
    if (!payment) return sendError(res, 'Payment record not found', 404);
    if (payment.status === 'paid') {
        return sendSuccess(res, 'Payment already verified', { plan: payment.plan });
    }

    // Mark paid
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'paid';
    await payment.save();

    // Activate subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + PLAN_DURATION_DAYS[payment.plan]);

    await Subscription.findOneAndUpdate(
        { business: payment.business },
        {
            user: payment.user,
            business: payment.business,
            plan: payment.plan,
            status: 'active',
            startDate,
            endDate,
        },
        { upsert: true, new: true }
    );

    await Business.findByIdAndUpdate(payment.business, {
        'subscription.plan': payment.plan,
        'subscription.status': 'active',
        'subscription.expiresAt': endDate,
    });

    return sendSuccess(res, 'Payment verified. Subscription activated!', {
        plan: payment.plan,
        expiresAt: endDate,
    });
});

// @desc    Get payment history
// @route   GET /api/payments
// @access  Private
const getPayments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [payments, total] = await Promise.all([
        Payment.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Payment.countDocuments({ user: req.user._id }),
    ]);

    return sendSuccess(res, 'Payments fetched', {
        payments,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});

module.exports = { createOrder, verifyPayment, getPayments };
