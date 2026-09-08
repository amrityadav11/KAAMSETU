# KaamSetu — Apne Business Ko Online Layein 🇮🇳

**KaamSetu** is a production-ready MERN SaaS platform that allows Indian local businesses to create a professional digital business page in under 10 minutes — no coding required. Businesses receive WhatsApp enquiries, phone calls, customer leads, analytics, and QR codes all from one dashboard.

---

## Features

- 🟢 **Professional business page** — mobile-first, shareable `/business/:slug` URL
- 💬 **WhatsApp click-to-chat** — custom message, click tracking
- 📞 **Direct call button** — one-tap calling with analytics
- 📋 **Enquiry form** — lead capture with status pipeline (new → contacted → converted → closed)
- 📸 **Gallery** — multi-image upload via Cloudinary
- ⚙️ **Services & Products** — list with prices, descriptions, images
- 📊 **Analytics** — page views, WhatsApp/phone clicks, QR scans, conversion rate with charts
- 🔲 **QR Code** — auto-generated on publish, downloadable, printable card
- 💳 **Razorpay payments** — STARTER (₹499/yr) and PRO (₹999/yr), HMAC signature verified
- 🛡️ **Admin panel** — user management, business moderation, payment history
- 🔐 **JWT auth** with HTTP-only cookies + Bearer token fallback
- 🗺️ **XML sitemap** at `/sitemap.xml` for SEO crawlers
- ⚡ **React.lazy** code-splitting for fast initial load

---

## 📚 Deployment Documentation

We've created comprehensive deployment guides for Vercel (frontend) + Render (backend):

| Document | Purpose | Time |
|---|---|---|
| **[QUICK_DEPLOY_STEPS.md](./QUICK_DEPLOY_STEPS.md)** | Step-by-step checklist to get live | ~30 min |
| **[DEPLOYMENT_VERCEL_RENDER.md](./DEPLOYMENT_VERCEL_RENDER.md)** | Complete guide with all details | Reference |
| **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** | How to get all API keys & secrets | ~10 min |
| **[DEPLOYMENT_TROUBLESHOOTING.md](./DEPLOYMENT_TROUBLESHOOTING.md)** | Common issues & fixes | Troubleshoot |
| **[DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md)** | Printable quick reference card | Reference |
| **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** | Overview & cost breakdown | Reference |

**Start here:** [QUICK_DEPLOY_STEPS.md](./QUICK_DEPLOY_STEPS.md)

---

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript, Tailwind CSS |
| Backend | Node.js 18+, Express.js |
| Database | MongoDB 6+, Mongoose |
| Auth | JWT, bcryptjs, HTTP-only cookies |
| Images | Cloudinary |
| Payments | Razorpay |
| QR Code | qrcode npm |
| Charts | Recharts |

---

## Folder Structure

```
kaamsetu/
├── client/                     # React + Vite frontend
│   └── src/
│       ├── components/common/  # Button, Input, Modal, Loader, ErrorBoundary …
│       ├── context/            # AuthContext
│       ├── hooks/              # useDocumentMeta (SEO)
│       ├── layouts/            # DashboardLayout, AdminLayout
│       ├── pages/              # auth/, dashboard/, public/, admin/
│       └── services/           # Axios API client
├── server/                     # Node.js + Express backend
│   ├── config/                 # DB + Cloudinary
│   ├── controllers/            # Business logic (all async-safe)
│   ├── middleware/             # auth, errorHandler, asyncHandler, validate
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routes + sitemap
│   ├── scripts/                # Seed script
│   └── utils/                  # response helpers, token utils, slugify
├── Procfile                    # Heroku deploy
├── render.yaml                 # Render deploy
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local `mongod` or Atlas free tier)
- Cloudinary account (free tier works)
- Razorpay account (test keys work)

### 1. Install dependencies

```bash
# In the kaamsetu/ folder:
npm install               # installs root concurrently
cd client && npm install
cd ../server && npm install
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
# Edit server/.env — fill in Mongo URI, Cloudinary and Razorpay keys
```

### 3. Seed demo data

```bash
cd server && npm run seed
```

Creates:
| Account | Email | Password |
|---|---|---|
| Business Owner | `demo@kaamsetu.in` | `Demo@1234` |
| Admin | `admin@kaamsetu.in` | `Admin@1234` |

Demo pages:
- `http://localhost:5173/business/vimla-janch-ghar` — Diagnostic Lab
- `http://localhost:5173/business/spice-route-restaurant` — Restaurant

### 4. Run in development

```bash
# From the kaamsetu/ root — runs both servers concurrently:
npm run dev

# Or individually:
npm run server   # API on :5001
npm run client   # Vite on :5173
```

---

## Environment Variables

All in `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/kaamsetu
JWT_SECRET=<long random secret — min 32 chars>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

NODE_ENV=development
PORT=5001
COOKIE_SECRET=<another long random secret>
```

---

## Deployment

### Quick Start (Recommended: Vercel + Render)

For detailed step-by-step instructions, see:
- **[QUICK_DEPLOY_STEPS.md](./QUICK_DEPLOY_STEPS.md)** — 30-min checklist
- **[DEPLOYMENT_VERCEL_RENDER.md](./DEPLOYMENT_VERCEL_RENDER.md)** — Full guide
- **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** — Get API keys and secrets

**Architecture:**
- Frontend on **Vercel** (React + Vite)
- Backend on **Render** (Node.js)
- Database on **MongoDB Atlas** (free M0 cluster)

**Cost:** $7/month (Render Starter plan) + free tiers for others

### Option A — Render (recommended, free tier available)

1. Push the repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Point to the repo, set **Root Directory** to `kaamsetu/`
4. Use the `render.yaml` already included — it configures everything
5. Add all env vars in the Render dashboard
6. Deploy the React client separately as a **Static Site**:
   - Build command: `npm install --prefix client && npm run build --prefix client`
   - Publish directory: `client/dist`
   - Set `CLIENT_URL` in the API service to the static site URL

### Option B — Heroku

```bash
# From kaamsetu/
heroku create kaamsetu-app
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=<atlas URI>
heroku config:set JWT_SECRET=<secret>
# … set all other vars …

git push heroku main
```

The `Procfile` already handles `node server/server.js`.

### Option C — VPS (Ubuntu/DigitalOcean)

```bash
# Build client
cd client && npm run build    # outputs to client/dist/

# The server serves client/dist in production (NODE_ENV=production)
cd ../server
NODE_ENV=production node server.js

# Or with PM2:
npm install -g pm2
pm2 start server.js --name kaamsetu
pm2 save && pm2 startup
```

### Option D — Full-stack on single Render service (monolithic)

Set `NODE_ENV=production` and the server will automatically serve `client/dist/` as static files with SPA fallback. Build client before deploying:

```bash
npm run build --prefix client
```

---

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Bearer | Logout |
| GET | `/api/auth/me` | Bearer | Current user |
| GET | `/api/businesses` | Public | List published businesses |
| GET | `/api/businesses/slug/:slug` | Public | Public business page |
| POST | `/api/businesses/slug/:slug/track/whatsapp` | Public | Track WhatsApp click |
| POST | `/api/businesses` | Bearer | Create business |
| PUT | `/api/businesses/:id` | Bearer | Update business |
| PUT | `/api/businesses/:id/publish` | Bearer | Publish business |
| POST | `/api/businesses/:id/logo` | Bearer | Upload logo |
| POST | `/api/businesses/:id/cover` | Bearer | Upload cover |
| POST | `/api/businesses/:id/qr` | Bearer | Regenerate QR |
| GET | `/api/services` | Bearer | Get services |
| POST | `/api/services` | Bearer | Add service |
| PUT | `/api/services/:id` | Bearer | Edit service |
| DELETE | `/api/services/:id` | Bearer | Delete service |
| GET | `/api/products` | Bearer | Get products |
| POST | `/api/products` | Bearer | Add product |
| GET | `/api/gallery` | Bearer | Get gallery |
| POST | `/api/gallery` | Bearer | Upload images |
| POST | `/api/leads/enquiry/:slug` | Public | Submit enquiry |
| GET | `/api/leads` | Bearer | Get leads |
| PUT | `/api/leads/:id` | Bearer | Update lead status |
| GET | `/api/analytics` | Bearer | Get analytics |
| POST | `/api/payments/create-order` | Bearer | Create Razorpay order |
| POST | `/api/payments/verify` | Bearer | Verify + activate |
| GET | `/api/admin/stats` | Admin | Platform overview |
| GET | `/api/admin/users` | Admin | All users |
| GET | `/api/admin/businesses` | Admin | All businesses |
| GET | `/api/admin/payments` | Admin | All payments |
| GET | `/sitemap.xml` | Public | SEO sitemap |
| GET | `/api/health` | Public | Health check |

---

## Security Checklist

- [x] Passwords hashed with bcrypt (cost 12)
- [x] JWT in HTTP-only cookies (not localStorage)
- [x] Rate limiting on all routes (stricter on auth)
- [x] Upload rate limiting
- [x] MongoDB injection sanitization (`express-mongo-sanitize`)
- [x] HTTP security headers (`helmet`)
- [x] CORS whitelist
- [x] Razorpay HMAC signature verification (never trust frontend payment status)
- [x] Input validation on all auth routes (`express-validator`)
- [x] Role-based authorization middleware
- [x] Regex-escaped city search (no ReDoS)
- [x] Unhandled promise rejections caught globally
- [x] Graceful shutdown on SIGTERM/SIGINT
- [x] No secrets in frontend code
- [x] `.gitignore` covers `.env`, `node_modules`, `uploads/`

---

## Acceptance Test Checklist

Run through this before going live:

- [ ] User registers → redirected to business setup
- [ ] User logs in → reaches dashboard
- [ ] Business created with name + category
- [ ] Logo and cover image upload
- [ ] Services added with prices
- [ ] Business published → public URL works
- [ ] WhatsApp button opens correct chat
- [ ] Call button triggers `tel:` link
- [ ] Enquiry form submits and appears in leads
- [ ] Lead status can be changed
- [ ] QR code generates, downloads, prints
- [ ] Analytics show page views and clicks
- [ ] Razorpay checkout opens (test key)
- [ ] Payment verifies → subscription activates
- [ ] Admin can view users, businesses, payments
- [ ] Admin can suspend a business
- [ ] `/sitemap.xml` returns valid XML
- [ ] Mobile layout looks correct at 390px

---

## License

MIT — Built with ❤️ in India 🇮🇳

© 2026 KaamSetu
