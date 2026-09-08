const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        caption: { type: String, trim: true, maxlength: [200, 'Caption cannot exceed 200 characters'] },
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

galleryImageSchema.index({ business: 1 });
galleryImageSchema.index({ business: 1, displayOrder: 1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
