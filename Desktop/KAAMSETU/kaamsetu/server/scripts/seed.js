require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const User = require('../models/User');
const Business = require('../models/Business');
const Service = require('../models/Service');
const Product = require('../models/Product');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Cleanup existing seed data
    await User.deleteMany({ email: { $in: ['demo@kaamsetu.in', 'admin@kaamsetu.in'] } });
    const demoBusinessSlugs = ['vimla-janch-ghar', 'spice-route-restaurant', 'glamour-salon', 'bright-future-coaching'];
    await Business.deleteMany({ slug: { $in: demoBusinessSlugs } });

    // Create demo owner
    const owner = await User.create({
        name: 'Ramesh Kumar',
        email: 'demo@kaamsetu.in',
        phone: '9876543210',
        password: 'Demo@1234',
        role: 'owner',
        isVerified: true,
    });

    // Create admin
    await User.create({
        name: 'KaamSetu Admin',
        email: 'admin@kaamsetu.in',
        phone: '9000000001',
        password: 'Admin@1234',
        role: 'admin',
        isVerified: true,
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // ── Vimla Janch Ghar ─────────────────────────────────────────────
    const vimlaQR = await QRCode.toDataURL(`${clientUrl}/business/vimla-janch-ghar`, {
        width: 400, margin: 2, color: { dark: '#16a34a', light: '#ffffff' },
    });

    const vimla = await Business.create({
        owner: owner._id,
        name: 'Vimla Janch Ghar',
        slug: 'vimla-janch-ghar',
        category: 'Diagnostic Lab',
        description:
            'Vimla Janch Ghar is a trusted diagnostic laboratory serving Patna for over 15 years. We provide accurate, affordable blood tests, urine tests, and health packages with home sample collection.',
        phone: '0612-2345678',
        whatsapp: '919876543210',
        whatsappMessage:
            'Hello Vimla Janch Ghar! I found your lab on KaamSetu. I would like to book a blood test.',
        email: 'vimlajanch@gmail.com',
        address: '12, Boring Road, Near Patna Junction',
        city: 'Patna',
        state: 'Bihar',
        pincode: '800001',
        isPublished: true,
        isVerified: true,
        qrCode: vimlaQR,
        views: 1240,
        whatsappClicks: 186,
        phoneClicks: 94,
        enquiryCount: 47,
        subscription: { plan: 'STARTER', status: 'active' },
        openingHours: [
            { day: 'Monday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
            { day: 'Tuesday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
            { day: 'Wednesday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
            { day: 'Thursday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
            { day: 'Friday', isOpen: true, openTime: '07:00', closeTime: '20:00' },
            { day: 'Saturday', isOpen: true, openTime: '07:00', closeTime: '18:00' },
            { day: 'Sunday', isOpen: true, openTime: '08:00', closeTime: '14:00' },
        ],
        setupStep: 9,
    });

    const labServices = [
        { name: 'Complete Blood Count (CBC)', description: 'Full blood picture including haemoglobin, WBC, platelets and RBC analysis.', price: 250, priceType: 'fixed', displayOrder: 1 },
        { name: 'Blood Sugar Fasting', description: 'Fasting glucose test to screen for diabetes.', price: 80, priceType: 'fixed', displayOrder: 2 },
        { name: 'Blood Sugar PP', description: 'Post-prandial glucose test after 2 hours of meal.', price: 80, priceType: 'fixed', displayOrder: 3 },
        { name: 'HbA1c (Glycated Haemoglobin)', description: 'Average blood sugar over last 3 months. Essential for diabetes monitoring.', price: 350, priceType: 'fixed', displayOrder: 4 },
        { name: 'Liver Function Test (LFT)', description: 'Complete liver panel including SGOT, SGPT, bilirubin, albumin.', price: 450, priceType: 'fixed', displayOrder: 5 },
        { name: 'Kidney Function Test (KFT)', description: 'Creatinine, urea, uric acid and electrolytes panel.', price: 400, priceType: 'fixed', displayOrder: 6 },
        { name: 'Lipid Profile', description: 'Cholesterol, triglycerides, HDL, LDL, VLDL — full cardiac risk panel.', price: 500, priceType: 'fixed', displayOrder: 7 },
        { name: 'Thyroid Profile (TSH, T3, T4)', description: 'Complete thyroid function assessment.', price: 600, priceType: 'fixed', displayOrder: 8 },
        { name: 'Urine Routine & Microscopy', description: 'Complete urine analysis for infection, kidney health screening.', price: 120, priceType: 'fixed', displayOrder: 9 },
        { name: 'Complete Health Checkup Package', description: 'CBC + LFT + KFT + Lipid Profile + Blood Sugar + Thyroid + Urine Routine. Best value.', price: 1499, priceType: 'fixed', displayOrder: 10 },
        { name: 'Dengue NS1 Antigen', description: 'Early dengue fever detection antigen test.', price: 600, priceType: 'fixed', displayOrder: 11 },
        { name: 'Malaria Antigen Test', description: 'Rapid antigen test for Plasmodium falciparum and vivax.', price: 300, priceType: 'fixed', displayOrder: 12 },
        { name: 'Home Sample Collection', description: 'Phlebotomist visits your home for blood collection. Available 7am–10am.', price: 100, priceType: 'fixed', displayOrder: 13 },
    ];

    for (const s of labServices) {
        await Service.create({ business: vimla._id, ...s });
    }

    // ── Spice Route Restaurant ─────────────────────────────────────────
    const spiceOwner = await User.create({
        name: 'Priya Sharma',
        email: 'priya@kaamsetu.in',
        phone: '9845001234',
        password: 'Demo@1234',
        role: 'owner',
        isVerified: true,
    });

    const spiceQR = await QRCode.toDataURL(`${clientUrl}/business/spice-route-restaurant`, {
        width: 400, margin: 2, color: { dark: '#16a34a', light: '#ffffff' },
    });

    const spice = await Business.create({
        owner: spiceOwner._id,
        name: 'Spice Route Restaurant',
        slug: 'spice-route-restaurant',
        category: 'Restaurant',
        description: 'Authentic North Indian cuisine with pure vegetarian thalis, street food, and refreshing beverages. Home delivery available.',
        phone: '9845001234',
        whatsapp: '919845001234',
        whatsappMessage: 'Hello Spice Route! I want to place an order.',
        address: 'Shop 4, Main Market, Rajendra Nagar',
        city: 'Patna',
        state: 'Bihar',
        pincode: '800016',
        isPublished: true,
        qrCode: spiceQR,
        views: 620,
        whatsappClicks: 95,
        subscription: { plan: 'FREE', status: 'active' },
        openingHours: [
            { day: 'Monday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
            { day: 'Tuesday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
            { day: 'Wednesday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
            { day: 'Thursday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
            { day: 'Friday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
            { day: 'Saturday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
            { day: 'Sunday', isOpen: true, openTime: '12:00', closeTime: '22:00' },
        ],
        setupStep: 9,
    });

    const menuItems = [
        { name: 'Thali (Full Meal)', description: 'Dal, sabzi, roti, rice, salad, pickle and papad.', price: 120, priceType: 'fixed', displayOrder: 1 },
        { name: 'Paneer Butter Masala', description: 'Rich tomato-based curry with soft paneer cubes. Served with naan.', price: 180, priceType: 'fixed', displayOrder: 2 },
        { name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter and cream.', price: 150, priceType: 'fixed', displayOrder: 3 },
        { name: 'Chole Bhature', description: 'Spiced chickpea curry with two fluffy bhature.', price: 100, priceType: 'fixed', displayOrder: 4 },
        { name: 'Masala Chai', description: 'Freshly brewed ginger chai with cardamom.', price: 20, priceType: 'fixed', displayOrder: 5 },
    ];

    for (const s of menuItems) {
        await Service.create({ business: spice._id, ...s });
    }

    console.log('\n✅ Seed data created successfully!\n');
    console.log('Demo accounts:');
    console.log('  Owner  → demo@kaamsetu.in  / Demo@1234');
    console.log('  Admin  → admin@kaamsetu.in / Admin@1234');
    console.log('\nDemo businesses:');
    console.log(`  ${clientUrl}/business/vimla-janch-ghar`);
    console.log(`  ${clientUrl}/business/spice-route-restaurant`);

    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
