const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
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
        discountPrice: {
            type: Number,
            min: [0, 'Discount price cannot be negative'],
        },
        image: { type: String, default: null },
        imagePublicId: { type: String, default: null },
        category: { type: String, trim: true },
        isAvailable: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

productSchema.index({ business: 1 });
productSchema.index({ business: 1, isAvailable: 1 });
productSchema.index({ business: 1, displayOrder: 1 });

module.exports = mongoose.model('Product', productSchema);
