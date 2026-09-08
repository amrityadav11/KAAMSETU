const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Service name is required'],
            trim: true,
            maxlength: [200, 'Service name cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        price: {
            type: Number,
            min: [0, 'Price cannot be negative'],
        },
        priceType: {
            type: String,
            enum: ['fixed', 'starting_from', 'on_request', 'free'],
            default: 'fixed',
        },
        image: { type: String, default: null },
        imagePublicId: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

serviceSchema.index({ business: 1 });
serviceSchema.index({ business: 1, isActive: 1 });
serviceSchema.index({ business: 1, displayOrder: 1 });

module.exports = mongoose.model('Service', serviceSchema);
