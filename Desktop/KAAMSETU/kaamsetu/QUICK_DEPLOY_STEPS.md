# Quick Deployment Checklist — Vercel + Render

Follow these steps in order. Estimated time: **30 minutes**

---

## Step 1: Prepare MongoDB Atlas ⏱️ ~5 min

### Create Free MongoDB

```
1. Go to https://mongodb.com/cloud/atlas
2. Sign up (or log in)
3. Click "Create" → Choose "Free M0 Cluster"
4. Region: ap-south-1 (or your region)
5. Wait for deployment (~5-10 min)
```

### Create Database User

```
1. Left sidebar → "Database Access"
2. "Add New Database User"
3. Username: kaamsetu_user
4. Password: Generate secure password (save it!)
5. Click "Add User"
```

### Allow All IPs

```
1. Left sidebar → "Network Access"
2. "Add IP Address"
3. Enter: 0.0.0.0/0
4. "Confirm"
```

### Get Connection String

```
1. Go back to "Databases"
2. Click "Connect"
3. "Connect your application"
4. Copy the connection string
5. Replace <password> with your password
```

**You now have:** `MONGO_URI=mongodb+srv://kaamsetu_user:YOUR_PASSWORD@...`

---

## Step 2: Push Code to GitHub ⏱️ ~3 min

```bash
cd c:\Users\amritspc\Desktop\KAAMSETU\kaamsetu

# Initialize git
git init
git add .
git commit -m "Initial commit: KaamSetu SaaS"
git branch -M main

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/kaamsetu.git

# Push
git push -u origin main
```

**You now have:** GitHub repo ready for Render & Vercel

---

## Step 3: Deploy Backend on Render ⏱️ ~10 min

### Create Web Service

```
1. Go to https://render.com (sign up if needed)
2. Click "New +" → "Web Service"
3. "Build and deploy from a Git repository"
4. Connect your GitHub account
5. Select "kaamsetu" repo
6. Click "Connect"
```

### Fill Configuration

| Field | Value |
|---|---|
| Name | `kaamsetu-api` |
| Environment | `Node` |
| Region | `Singapore` |
| Branch | `main` |
| Root Directory | (leave empty) |
| Build Command | `npm install --prefix server` |
| Start Command | `node server/server.js` |

### Add Environment Variables

Click **Environment** and paste these:

```
MONGO_URI=mongodb+srv://kaamsetu_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kaamsetu?retryWrites=true&w=majority
JWT_SECRET=generate_random_32_char_string_1a2b3c4d5e6f7g8h
JWT_EXPIRES_IN=7d
CLIENT_URL=https://kaamsetu.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
NODE_ENV=production
PORT=5001
COOKIE_SECRET=generate_another_random_32_char_string
```

### Deploy

Click **Create Web Service** and wait (~2-3 min)

**You now have:**
- Backend URL: `https://kaamsetu-api.onrender.com` (or similar)
- ⚠️ Note: Save this URL

---

## Step 4: Deploy Frontend on Vercel ⏱️ ~8 min

### Create Project

```
1. Go to https://vercel.com (sign up if needed)
2. Click "Add New" → "Project"
3. "Import Git Repository"
4. Select "kaamsetu" repo
5. Click "Import"
```

### Configure Build

| Field | Value |
|---|---|
| Framework | `Vite` |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Add Environment Variables

In **Environment Variables** section:

```
VITE_API_URL=https://kaamsetu-api.onrender.com
```

(Replace with your Render URL from Step 3)

### Deploy

Click **Deploy** and wait (~2-3 min)

**You now have:** Frontend URL: `https://kaamsetu.vercel.app` (or similar)

---

## Step 5: Verify Everything Works ⏱️ ~3 min

### Test Backend

```bash
# In PowerShell:
Invoke-WebRequest -Uri "https://kaamsetu-api.onrender.com/api/health"
```

Should show:
```
StatusCode : 200
```

### Test Frontend

```
1. Open https://kaamsetu.vercel.app in browser
2. F12 to open DevTools → Console
3. Look for any red errors
4. Try to log in with:
   - Email: demo@kaamsetu.in
   - Password: Demo@1234
```

### If Login Fails

Check browser console (F12) for errors. Common issues:

| Error | Fix |
|---|---|
| **CORS error** | Check `CLIENT_URL` in Render is correct |
| **404 on API** | Check `VITE_API_URL` in Vercel is correct |
| **MongoDB error** | Check `MONGO_URI` in Render is correct |
| **Blank page** | Hard refresh (Ctrl+Shift+R) |

---

## Step 6: (Optional) Seed Demo Data ⏱️ ~2 min

To populate demo businesses:

### Option A: Using Render Terminal

```
1. Go to your service on Render
2. Click "Shell"
3. Run: npm run seed --prefix server
```

### Option B: Using SSH (if available)

```bash
# From your machine
npm run seed --prefix server
```

---

## Environment Variables Summary

### Backend (.env on Render)

```env
# Critical (no localhost!)
MONGO_URI=mongodb+srv://kaamsetu_user:PASSWORD@cluster.mongodb.net/kaamsetu?retryWrites=true&w=majority
JWT_SECRET=your_random_32_char_secret_here
CLIENT_URL=https://your-vercel-domain

# Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_secret

# Standard
NODE_ENV=production
PORT=5001
JWT_EXPIRES_IN=7d
COOKIE_SECRET=another_random_32_char_secret
```

### Frontend (.env on Vercel)

```env
VITE_API_URL=https://your-render-backend-url
```

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---|---|
| **"502 Bad Gateway" on Vercel** | Backend might be spinning down. Check Render logs. |
| **CORS errors in console** | Update `CLIENT_URL` in Render to match Vercel URL. Redeploy. |
| **"Cannot GET /api/health"** | Backend not running. Check Render logs for errors. |
| **"Cannot read properties of undefined"** | `VITE_API_URL` not set on Vercel. Add it and redeploy. |
| **Login always fails** | Check MongoDB connection in Render logs. |
| **Blank white page** | Hard refresh (Ctrl+Shift+R) and check browser console (F12). |
| **Free tier spinning down** | Upgrade Render to **Starter** ($7/month) or add a ping service. |

---

## Next: Monitor & Maintain

### Render Dashboard

```
1. View logs: https://dashboard.render.com
2. Check for errors every few hours
3. Monitor free tier status
```

### Vercel Dashboard

```
1. View deployments: https://vercel.com/dashboard
2. Auto-deploys on every GitHub push
```

### GitHub

```bash
# Push updates
git add .
git commit -m "Update feature"
git push origin main

# Both Render and Vercel auto-deploy on push!
```

---

## Cost Summary

| Service | Free Tier | Recommended | Cost |
|---|---|---|---|
| Vercel | ✅ Always free | Same | **$0** |
| Render | ❌ Spins down | Starter | **$7/mo** |
| MongoDB | ✅ 512MB | Same | **$0** |
| Cloudinary | ✅ 25GB/year | Same | **$0** |
| **Total** | Spins down | **Recommended** | **$7/mo** |

---

## Success! 🎉

Your KaamSetu is now live!

- **Frontend:** https://kaamsetu.vercel.app
- **Backend:** https://kaamsetu-api.onrender.com
- **Public URL:** https://kaamsetu.vercel.app/businesses

Next steps:
1. Create a business account
2. Add products/services
3. Publish and share the link
4. Monitor analytics

---

For detailed info, see: `DEPLOYMENT_VERCEL_RENDER.md`
