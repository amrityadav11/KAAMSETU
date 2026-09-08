# KaamSetu Deployment — Vercel (Frontend) + Render (Backend)

This guide walks through deploying KaamSetu with:
- **Frontend** on Vercel (React + Vite)
- **Backend** on Render (Node.js + Express)
- **Database** MongoDB Atlas (free tier)

---

## Prerequisites

- GitHub account (for pushing code)
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (free tier M0)
- Cloudinary account (free tier)
- Razorpay account (test/live keys)

---

## Part 1: Set Up MongoDB Atlas

### 1. Create a free M0 cluster

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **Create** → select **Free M0** cluster
4. Choose a region (e.g., `ap-south-1` for India)
5. Wait for cluster to deploy (~5-10 min)

### 2. Create a database user

1. In the left sidebar, go to **Database Access**
2. Click **Add New Database User**
3. Set username: `kaamsetu_user`
4. Set password: `<generate strong password>` (save it!)
5. Click **Add User**

### 3. Get the connection string

1. Go back to **Databases**
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string:
   ```
   mongodb+srv://kaamsetu_user:<password>@cluster0.xxxxx.mongodb.net/kaamsetu?retryWrites=true&w=majority
   ```
   Replace `<password>` with the user password from Step 2.

### 4. Allow all IPs (for Render)

1. In **Network Access**
2. Click **Add IP Address**
3. Enter `0.0.0.0/0` (allow all) — works for Render
4. Click **Confirm**

---

## Part 2: Deploy Backend on Render

### 1. Push code to GitHub

```bash
# From the kaamsetu root:
git init
git add .
git commit -m "Initial commit: KaamSetu SaaS"
git branch -M main
git remote add origin https://github.com/<your-username>/kaamsetu.git
git push -u origin main
```

### 2. Create a new Render Web Service

1. Go to [render.com](https://render.com) and sign up
2. Click **New +** → **Web Service**
3. Select **Build and deploy from a Git repository**
4. Connect your GitHub account (authorize Render)
5. Select the `kaamsetu` repository

### 3. Configure the Web Service

Fill in the following:

| Field | Value |
|---|---|
| **Name** | `kaamsetu-api` |
| **Environment** | `Node` |
| **Region** | `Singapore` (or closest to India) |
| **Branch** | `main` |
| **Build Command** | `npm install --prefix server` |
| **Start Command** | `node server/server.js` |

### 4. Set Environment Variables

Click **Environment** and add these (copy from your `.env`):

```
MONGO_URI=mongodb+srv://kaamsetu_user:<password>@cluster0.xxxxx.mongodb.net/kaamsetu?retryWrites=true&w=majority
JWT_SECRET=<generate random 32+ char string>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://<your-frontend-domain-on-vercel>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
RAZORPAY_KEY_ID=<your-razorpay-test-or-live-id>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
NODE_ENV=production
PORT=5001
COOKIE_SECRET=<generate random 32+ char string>
```

**Note:** Don't use `localhost` URLs — use the actual Vercel domain once deployed.

### 5. Deploy

Click **Create Web Service** — Render will build and deploy automatically.

**Your backend URL will be:** `https://kaamsetu-api.onrender.com` (or similar)

**⚠️ Note:** Free tier on Render spins down after 15 min of inactivity. Upgrade to paid ($7/mo) to keep it always on.

---

## Part 3: Deploy Frontend on Vercel

### 1. Create a Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import the GitHub repo
4. Select the `kaamsetu` repository

### 2. Configure Build Settings

| Field | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3. Set Environment Variables (for Vercel)

In the **Environment Variables** section, add:

```
VITE_API_URL=https://kaamsetu-api.onrender.com
```

**Note:** This will be used in your `client/src/services/api.js` to point to the Render backend.

### 4. Deploy

Click **Deploy** — Vercel will build and deploy automatically.

**Your frontend URL will be:** `https://kaamsetu.vercel.app` (or your custom domain)

---

## Part 4: Update Frontend API Client

Now update your frontend to use the Render backend URL:

### Edit `client/src/services/api.js`

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // for cookies
});

// ... rest of the file remains the same
export default api;
```

### Update `client/vite.config.js` (development only)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true,
            },
        },
    },
    // ... rest of config
});
```

### Push changes to GitHub

```bash
git add .
git commit -m "Update API URL for production deployment"
git push origin main
```

Vercel will auto-deploy on push.

---

## Part 5: Update Backend CORS

Update `server/server.js` to allow your Vercel domain:

```javascript
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://kaamsetu.vercel.app', // Add your Vercel URL
];
```

Push to GitHub again:

```bash
git add server/server.js
git commit -m "Update CORS for Vercel domain"
git push origin main
```

Render will auto-deploy on push.

---

## Part 6: Verify Deployment

### Test Backend Health

```bash
curl https://kaamsetu-api.onrender.com/api/health
```

Should return:
```json
{"success":true,"message":"KaamSetu API is running","env":"production","timestamp":"..."}
```

### Test Frontend

1. Open `https://kaamsetu.vercel.app`
2. Try logging in with demo credentials:
   - Email: `demo@kaamsetu.in`
   - Password: `Demo@1234`
3. Check browser DevTools Console (F12) for any CORS errors

### Seed Demo Data (Optional)

To populate demo businesses:

```bash
# SSH into Render backend or run locally:
cd server
npm run seed
```

---

## Part 7: Custom Domain (Optional)

### Vercel

1. Go to **Project Settings** → **Domains**
2. Add your domain (e.g., `kaamsetu.com`)
3. Follow DNS instructions from Vercel
4. Update `CLIENT_URL` in Render env vars

### Render

1. Go to **Settings** → **Custom Domains**
2. Add your subdomain (e.g., `api.kaamsetu.com`)
3. Follow DNS instructions from Render

---

## Part 8: Environment Variables Reference

### Backend (.env for Render)

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kaamsetu?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_very_long_random_secret_min_32_chars_1a2b3c4d5e6f
JWT_EXPIRES_IN=7d

# Client URL (set to your Vercel domain)
CLIENT_URL=https://kaamsetu.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Node env
NODE_ENV=production
PORT=5001

# Cookie
COOKIE_SECRET=your_long_random_secret_for_cookies_min_32_chars
```

### Frontend (.env for Vercel)

```env
VITE_API_URL=https://kaamsetu-api.onrender.com
```

---

## Troubleshooting

### "Port 5001 in use" error

This shouldn't happen on Render, but if deploying locally:

```bash
# Kill the process:
lsof -i :5001
kill -9 <PID>
```

### CORS errors after deployment

**Check:**
1. `CLIENT_URL` env var on Render matches your Vercel URL
2. `VITE_API_URL` on Vercel matches your Render URL
3. Both domains added to `allowedOrigins` in `server.js`

### MongoDB connection fails

**Check:**
1. Connection string is correct (user + password)
2. IP whitelist allows `0.0.0.0/0` (or add Render's IP)
3. Database user was created in MongoDB Atlas

### Render backend spins down

Free tier spins down after 15 min of inactivity. Either:
- Upgrade to **Starter plan** ($7/month)
- Add a ping service to keep it alive (e.g., [kping.app](https://kping.app))

---

## Cost Breakdown (Monthly)

| Service | Free Tier | Recommended | Cost |
|---|---|---|---|
| Vercel | ✅ Included | Same | $0 |
| Render | ❌ Spins down | Starter | $7 |
| MongoDB Atlas | ✅ M0 (512MB) | M2 (10GB) | $0–$19 |
| Cloudinary | ✅ Included | Same | $0 |
| **Total** | $0 | — | $7–$26 |

---

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy backend on Render
3. ✅ Deploy frontend on Vercel
4. ✅ Update API URLs
5. ✅ Test the live app
6. ✅ Seed demo data (optional)
7. ✅ Configure custom domain (optional)
8. ✅ Monitor Render logs for issues

---

## Useful Links

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Razorpay Docs](https://razorpay.com/docs)

---

**Good luck with your deployment! 🚀**
