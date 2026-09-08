require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// ─── Security Headers (helmet) ───────────────────────────────────────────────
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: false, // handled by client for SPA
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    })
);

// MongoDB query injection sanitization
app.use(mongoSanitize({ replaceWith: '_' }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    // Local development
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173', // vite preview
    // Production (Vercel)
    'https://*.vercel.app',
];

app.use(
    cors({
        origin: (origin, cb) => {
            // Allow requests with no origin (mobile apps, curl, Postman)
            if (!origin) return cb(null, true);

            // Check exact match
            if (allowedOrigins.includes(origin)) return cb(null, true);

            // Check wildcard patterns
            const isAllowed = allowedOrigins.some(allowed => {
                if (allowed.includes('*')) {
                    const regex = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
                    return regex.test(origin);
                }
                return false;
            });

            if (isAllowed) return cb(null, true);
            cb(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15, // slightly more generous for dev testing
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many auth attempts. Please try again later.' },
});

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50,
    message: { success: false, message: 'Upload limit reached. Try again later.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/businesses/:id/logo', uploadLimiter);
app.use('/api/businesses/:id/cover', uploadLimiter);
app.use('/api/gallery', uploadLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/businesses', require('./routes/businessRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ─── Sitemap ──────────────────────────────────────────────────────────────────
app.use('/sitemap.xml', require('./routes/sitemapRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'KaamSetu API is running',
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ─── Serve React build in production ──────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
    const clientBuild = path.join(__dirname, '..', 'client', 'dist');
    app.use(express.static(clientBuild, { maxAge: '7d' }));

    // SPA fallback — serve index.html for all non-API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuild, 'index.html'));
    });
} else {
    // API 404 handler in development
    app.use('/api/*', (req, res) => {
        res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found` });
    });
}

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`🚀 KaamSetu API running on port ${PORT} [${process.env.NODE_ENV}]`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received — shutting down gracefully');
    server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
    server.close(() => process.exit(0));
});

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

module.exports = app;
