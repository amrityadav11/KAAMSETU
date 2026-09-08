# 🚀 Deployment Summary — Vercel + Render

## What You're Getting

This guide sets up KaamSetu with:
- ✅ **Frontend** hosted on Vercel (free, auto-deploys on git push)
- ✅ **Backend** hosted on Render ($7/month starter tier)
- ✅ **Database** on MongoDB Atlas (free 512MB M0 cluster)
- ✅ **CDN** via Vercel (instant global cache)
- ✅ **Custom domains** support on both
- ✅ **HTTPS** by default on both

---

## Files Created for You

| File | Purpose |
|---|---|
| `QUICK_DEPLOY_STEPS.md` | **Start here** — 6-step checklist (~30 min) |
| `DEPLOYMENT_VERCEL_RENDER.md` | Complete guide with all details |
| `ENV_SETUP_GUIDE.md` | How to get all API keys and secrets |
| `vercel.json` | Vercel build configuration |
| `render-build.sh` | Render build script |
| `.env.example` | Template for environment variables |

---

## Quick Start (TL;DR)

### 1. Get Secrets (5 min)
```
- MongoDB Atlas connection string
- Cloudinary API keys
- Razorpay test keys
- Random JWT secrets
```
👉 See `ENV_SETUP_GUIDE.md`

### 2. Push to GitHub (3 min)
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/kaamsetu.git
git push -u origin main
```

### 3. Deploy Backend on Render (10 min)
```
1. Sign up at render.com
2. New Web Service → Select GitHub repo
3. Build: npm install --prefix server
4. Start: node server/server.js
5. Add environment variables
6. Deploy
```

### 4. Deploy Frontend on Vercel (8 min)
```
1. Sign up at vercel.com
2. Import GitHub repo
3. Root Directory: client
4. Build: npm run build
5. Add VITE_API_URL env var
6. Deploy
```

### 5. Test (3 min)
```
1. Open https://kaamsetu.vercel.app
2. F12 → Console (check for errors)
3. Try logging in
```

**Total time: ~30 minutes** ⏱️

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│                   (Source of Truth)                       │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐           ┌──────────┐
   │ Vercel  │           │  Render  │
   │         │           │          │
   │Frontend │           │ Backend  │
   │(React)  │──────────▶│(Node.js) │
   └────┬────┘           └─────┬────┘
        │                       │
        │ HTTPS                 │ HTTPS
        │ Auto-deploy           │ Auto-deploy
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
            ┌──────────────────┐
            │  MongoDB Atlas   │
            │   (Database)     │
            └──────────────────┘
```

---

## Environment Variables Checklist

### Render Backend (.env)

```env
# CRITICAL — Get these from guides below
□ MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/kaamsetu...
□ JWT_SECRET=your_random_32_char_secret
□ CLIENT_URL=https://kaamsetu.vercel.app
□ CLOUDINARY_CLOUD_NAME=your_cloud_name
□ CLOUDINARY_API_KEY=your_key
□ CLOUDINARY_API_SECRET=your_secret
□ RAZORPAY_KEY_ID=rzp_test_xxxxx
□ RAZORPAY_KEY_SECRET=your_secret

# Standard (keep as-is)
□ NODE_ENV=production
□ PORT=5001
□ JWT_EXPIRES_IN=7d
□ COOKIE_SECRET=your_random_32_char_secret
```

### Vercel Frontend (.env)

```env
□ VITE_API_URL=https://kaamsetu-api.onrender.com
```

---

## Getting Credentials

| Service | Guide | Cost |
|---|---|---|
| **MongoDB** | [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md#1-mongodb-atlas-mongo_uri) | Free |
| **Cloudinary** | [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md#3-cloudinary-image-uploads) | Free |
| **Razorpay** | [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md#4-razorpay-payments) | Free (test keys) |
| **JWT Secrets** | [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md#2-jwt-secrets-jwt_secret-cookie_secret) | N/A (generate) |

---

## Step-by-Step Deployment

### Phase 1: Preparation (10 min)

1. **Get all secrets** → See `ENV_SETUP_GUIDE.md`
2. **Push to GitHub** → `git push origin main`
3. **Create Render account** → [render.com](https://render.com)
4. **Create Vercel account** → [vercel.com](https://vercel.com)

### Phase 2: Render Backend (10 min)

1. **New Web Service** on Render
2. **Connect GitHub repo**
3. **Configure build settings:**
   - Build: `npm install --prefix server`
   - Start: `node server/server.js`
4. **Add environment variables** (from Phase 1)
5. **Deploy** and wait 2-3 min

→ You now have: `https://kaamsetu-api.onrender.com`

### Phase 3: Vercel Frontend (8 min)

1. **Import project** on Vercel
2. **Configure root: `client`**
3. **Add VITE_API_URL** env var (from Phase 2)
4. **Deploy** and wait 2-3 min

→ You now have: `https://kaamsetu.vercel.app`

### Phase 4: Verify (5 min)

1. **Test API:** `curl https://kaamsetu-api.onrender.com/api/health`
2. **Test frontend:** Open `https://kaamsetu.vercel.app`
3. **Check browser console:** F12 → Console (no red errors?)
4. **Try login:** demo@kaamsetu.in / Demo@1234

---

## Troubleshooting

### Frontend shows blank page

```
1. Hard refresh: Ctrl+Shift+R
2. Open DevTools: F12
3. Check Console tab for errors
4. Look for CORS or 404 errors
```

**If CORS error:** 
- Check `CLIENT_URL` on Render matches Vercel domain
- Redeploy Render service

### Backend returns 502

```
1. Check Render logs (Dashboard → Logs)
2. Verify MONGO_URI is correct
3. Check MongoDB Atlas IP whitelist (0.0.0.0/0)
4. Look for crash errors in logs
```

### Login fails silently

```
1. Check browser Console (F12)
2. Check Render backend logs
3. Verify `VITE_API_URL` is set on Vercel
4. Redeploy Vercel
```

### Blank after login

```
1. Hard refresh (Ctrl+Shift+R)
2. Check Console for JavaScript errors
3. Check Network tab for 404s
4. Verify API responses
```

---

## Monitoring & Maintenance

### Daily
- Check Render dashboard for errors
- Monitor free tier status

### Weekly
- Review API logs on Render
- Check deployment history on Vercel

### Monthly
- Review analytics
- Test payment flow (test keys)
- Backup MongoDB (Atlas auto-backups)

---

## Upgrading (Later)

### Render: Keep It Always On
```
Current: Free tier spins down after 15 min
Upgrade: Starter ($7/month) — always on
```

### MongoDB: Store More Data
```
Current: M0 cluster (512MB)
Upgrade: M2 ($9/month) — 10GB
```

### Custom Domain
```
Vercel: Add domain in Project Settings
Render: Add domain in Service Settings
```

---

## Security Notes

### Before Going Live

- [ ] Change Razorpay keys from test to live
- [ ] Use strong, unique JWT secrets (32+ chars)
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Add rate limiting (already in code)
- [ ] Test SQL/NoSQL injection (covered by validation)
- [ ] Never commit `.env` to GitHub

### Ongoing

- [ ] Rotate JWT secrets monthly
- [ ] Monitor Render logs for errors
- [ ] Keep dependencies updated
- [ ] Review MongoDB access logs
- [ ] Use API rate limiting

---

## Cost Estimate

### Minimum ($7/month)
```
Vercel (Frontend)    →  $0 (free tier)
Render (Backend)     →  $7/month (Starter)
MongoDB             →  $0 (free M0)
Cloudinary          →  $0 (free 25GB/year)
────────────────────────────────
Total              →  $7/month
```

### Recommended ($12-20/month)
```
Vercel               →  $0 (free)
Render               →  $7 (Starter)
MongoDB (M2)         →  $9 (10GB)
Cloudinary           →  $0 (free)
────────────────────────────────
Total               →  $16/month
```

---

## What's Next?

1. ✅ Get credentials → `ENV_SETUP_GUIDE.md`
2. ✅ Deploy backend → `QUICK_DEPLOY_STEPS.md` (Step 3)
3. ✅ Deploy frontend → `QUICK_DEPLOY_STEPS.md` (Step 4)
4. ✅ Test live → `QUICK_DEPLOY_STEPS.md` (Step 5)
5. ✅ Seed demo data → `QUICK_DEPLOY_STEPS.md` (Step 6)
6. 🎉 You're live!

---

## Support Resources

| Need | Where |
|---|---|
| Step-by-step checklist | `QUICK_DEPLOY_STEPS.md` |
| Detailed guide | `DEPLOYMENT_VERCEL_RENDER.md` |
| API key setup | `ENV_SETUP_GUIDE.md` |
| Configuration | `vercel.json`, `render-build.sh` |
| Main README | `README.md` |

---

**Ready to deploy? Start with `QUICK_DEPLOY_STEPS.md`! 🚀**
