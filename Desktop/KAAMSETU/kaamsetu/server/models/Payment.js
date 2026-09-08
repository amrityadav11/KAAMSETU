const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        razorpayOrderId: { type: String, required: true },
        razorpayPaymentId: { type: String, default: null },
        razorpaySignature: { type: String, default: null },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        status: {
            type: String,
            enum: ['created', 'paid', 'failed', 'refunded'],
            default: 'created',
        },
        plan: {
            type: String,
            enum: ['STARTER', 'PRO'],
            required: true,
        },
    },
    { timestamps: true }
);

paymentSchema.index({ user: 1 });
paymentSchema.index({ business: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
