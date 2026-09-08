const mongoose = require('mongoose');

const openingHoursSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        isOpen: { type: Boolean, default: true },
        openTime: { type: String, default: '09:00' },
        closeTime: { type: String, default: '18:00' },
    },
    { _id: false }
);

const businessSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Business name is required'],
            trim: true,
            maxlength: [200, 'Business name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'Diagnostic Lab',
                'Clinic',
                'Pharmacy',
                'Restaurant',
                'Salon',
                'Gym',
                'Coaching Centre',
                'Grocery Store',
                'Clothing Store',
                'Electronics Store',
                'Mobile Shop',
                'Photographer',
                'Hotel',
                'Repair Service',
                'Freelancer',
                'Other',
            ],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        logo: { type: String, default: null },
        logoPublicId: { type: String, default: null },
        coverImage: { type: String, default: null },
        coverImagePublicId: { type: String, default: null },
        phone: {
            type: String,
            trim: true,
        },
        whatsapp: {
            type: String,
            trim: true,
        },
        whatsappMessage: {
            type: String,
            default:
                'Hello, I found your business on KaamSetu. I would like to know more about your services.',
            maxlength: [500, 'WhatsApp message cannot exceed 500 characters'],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        website: { type: String, trim: true },
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        location: {
            latitude: { type: Number },
            longitude: { type: Number },
        },
        openingHours: [openingHoursSchema],
        socialLinks: {
            facebook: { type: String, trim: true },
            instagram: { type: String, trim: true },
            twitter: { type: String, trim: true },
            youtube: { type: String, trim: true },
        },
        qrCode: { type: String, default: null },
        isPublished: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        subscription: {
            plan: { type: String, enum: ['FREE', 'STARTER', 'PRO'], default: 'FREE' },
            status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
            expiresAt: { type: Date, default: null },
        },
        views: { type: Number, default: 0 },
        whatsappClicks: { type: Number, default: 0 },
        phoneClicks: { type: Number, default: 0 },
        enquiryCount: { type: Number, default: 0 },
        setupStep: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Indexes
businessSchema.index({ owner: 1 });
businessSchema.index({ category: 1 });
businessSchema.index({ city: 1 });
businessSchema.index({ isPublished: 1 });
businessSchema.index({ createdAt: -1 });
businessSchema.index({ name: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('Business', businessSchema);
