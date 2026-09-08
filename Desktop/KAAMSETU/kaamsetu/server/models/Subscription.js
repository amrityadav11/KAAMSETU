const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
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
        plan: {
            type: String,
            enum: ['FREE', 'STARTER', 'PRO'],
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled', 'pending'],
            default: 'active',
        },
        razorpaySubscriptionId: { type: String, default: null },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, default: null },
        autoRenew: { type: Boolean, default: false },
    },
    { timestamps: true }
);

subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ business: 1 });
subscriptionSchema.index({ status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
