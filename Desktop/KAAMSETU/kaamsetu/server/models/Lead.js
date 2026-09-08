const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        message: {
            type: String,
            trim: true,
            maxlength: [2000, 'Message cannot exceed 2000 characters'],
        },
        source: {
            type: String,
            enum: ['enquiry_form', 'whatsapp', 'phone', 'direct'],
            default: 'enquiry_form',
        },
        status: {
            type: String,
            enum: ['new', 'contacted', 'converted', 'closed'],
            default: 'new',
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Notes cannot exceed 1000 characters'],
        },
    },
    { timestamps: true }
);

leadSchema.index({ business: 1 });
leadSchema.index({ business: 1, status: 1 });
leadSchema.index({ business: 1, createdAt: -1 });

module.exports = mongoose.model('Lead', leadSchema);
