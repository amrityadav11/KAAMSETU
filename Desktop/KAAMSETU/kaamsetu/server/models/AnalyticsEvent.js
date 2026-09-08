const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['page_view', 'whatsapp_click', 'phone_click', 'enquiry', 'qr_scan'],
        },
        visitorId: { type: String },
        ipHash: { type: String },
        userAgent: { type: String },
        referrer: { type: String },
    },
    { timestamps: true }
);

analyticsEventSchema.index({ business: 1 });
analyticsEventSchema.index({ business: 1, type: 1 });
analyticsEventSchema.index({ business: 1, createdAt: -1 });
analyticsEventSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
