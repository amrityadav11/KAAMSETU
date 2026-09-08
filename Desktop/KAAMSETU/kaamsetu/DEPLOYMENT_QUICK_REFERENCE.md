# Quick Reference Card

Print this or keep it handy while deploying!

---

## URLs You'll Need

| Service | What | URL |
|---|---|---|
| **GitHub** | Code repository | https://github.com/YOUR_USERNAME/kaamsetu |
| **MongoDB Atlas** | Database | https://mongodb.com/cloud/atlas |
| **Render** | Backend host | https://render.com |
| **Vercel** | Frontend host | https://vercel.com |
| **Cloudinary** | Images | https://cloudinary.com |
| **Razorpay** | Payments | https://razorpay.com |

---

## Credentials Checklist

Print and fill in as you get them:

```
□ MongoDB URI
  mongodb+srv://kaamsetu_user:________@cluster0.xxxxx.mongodb.net/kaamsetu

□ JWT Secret (32+ random chars)
  ________________________________________________________

□ Cookie Secret (32+ random chars)
  ________________________________________________________

□ Cloudinary Cloud Name
  ________________________________________________________

□ Cloudinary API Key
  ________________________________________________________

□ Cloudinary API Secret
  ________________________________________________________

□ Razorpay Key ID (starts with rzp_test_)
  ________________________________________________________

□ Razorpay Key Secret
  ________________________________________________________

□ Vercel Frontend URL
  https://kaamsetu.vercel.app

□ Render Backend URL
  https://kaamsetu-api.onrender.com
```

---

## Deployment Steps

### Phase 1: Setup (Do Once)

```
[ ] 1. Create MongoDB Atlas account → Get MONGO_URI
[ ] 2. Create Cloudinary account → Get API keys
[ ] 3. Create Razorpay account → Get test keys
[ ] 4. Create GitHub account → Push code
[ ] 5. Create Render account
[ ] 6. Create Vercel account
```

### Phase 2: Deploy Backend (Render)

```
[ ] 1. Log in to render.com
[ ] 2. Click "New +" → "Web Service"
[ ] 3. Select GitHub repo (kaamsetu)
[ ] 4. Name: kaamsetu-api
[ ] 5. Build: npm install --prefix server
[ ] 6. Start: node server/server.js
[ ] 7. Add environment variables (8 total)
[ ] 8. Click "Create Web Service"
[ ] 9. Wait for deployment (2-3 min)
[ ] 10. Save backend URL
```

### Phase 3: Deploy Frontend (Vercel)

```
[ ] 1. Log in to vercel.com
[ ] 2. Click "Add New" → "Project"
[ ] 3. Import GitHub repo (kaamsetu)
[ ] 4. Root Directory: client
[ ] 5. Build: npm run build
[ ] 6. Add VITE_API_URL = your backend URL
[ ] 7. Click "Deploy"
[ ] 8. Wait for deployment (2-3 min)
[ ] 9. Save frontend URL
```

### Phase 4: Verify (Once live)

```
[ ] 1. Test backend: curl https://your-backend-url/api/health
[ ] 2. Open frontend in browser
[ ] 3. F12 → Console (no red errors?)
[ ] 4. Try logging in
[ ] 5. Try creating a business
```

---

## Environment Variables Template

### Copy-paste to Render

```env
MONGO_URI=mongodb+srv://kaamsetu_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kaamsetu?retryWrites=true&w=majority
JWT_SECRET=YOUR_RANDOM_32_CHAR_STRING
JWT_EXPIRES_IN=7d
CLIENT_URL=https://kaamsetu.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
NODE_ENV=production
PORT=5001
COOKIE_SECRET=YOUR_RANDOM_32_CHAR_STRING
```

### Copy-paste to Vercel

```env
VITE_API_URL=https://kaamsetu-api.onrender.com
```

---

## Test Credentials (For Testing)

```
Email:    demo@kaamsetu.in
Password: Demo@1234

Razorpay Test Card:
  Number:  4111 1111 1111 1111
  CVV:     Any 3 digits
  Date:    Any future date
```

---

## Git Commands

```bash
# Push to GitHub
git add .
git commit -m "Deployment: Vercel + Render"
git push origin main

# Both Render and Vercel auto-deploy!
```

---

## Help Commands

```bash
# Test Render backend from terminal
curl https://your-backend-url/api/health

# Test MongoDB locally
cd server && npm run dev

# Check Node version
node --version

# Check npm version
npm --version
```

---

## Common Errors & Fixes

| Error | Fix |
|---|---|
| **502 Bad Gateway** | Render sleeping or CORS issue |
| **CORS blocked** | Verify CLIENT_URL on Render |
| **Cannot read undefined** | Check VITE_API_URL on Vercel |
| **MongoDB connection error** | Verify MONGO_URI + IP whitelist |
| **Blank page after login** | Hard refresh (Ctrl+Shift+R) |
| **Payment fails** | Use rzp_test_ (not rzp_live_) |
| **Images not loading** | Check Cloudinary credentials |

---

## Support Links

| Need | Link |
|---|---|
| **Quick steps** | See `QUICK_DEPLOY_STEPS.md` |
| **Full guide** | See `DEPLOYMENT_VERCEL_RENDER.md` |
| **Get credentials** | See `ENV_SETUP_GUIDE.md` |
| **Fix issues** | See `DEPLOYMENT_TROUBLESHOOTING.md` |
| **Render docs** | https://render.com/docs |
| **Vercel docs** | https://vercel.com/docs |

---

## Cost (Monthly)

```
Vercel (Frontend)       $0
Render (Backend)        $7 (Starter)
MongoDB                 $0 (free M0)
Cloudinary              $0 (free 25GB)
────────────────────────────
Total                   $7
```

---

## Timeline

```
Setup credentials       → 5 min
Push to GitHub         → 3 min
Deploy Render          → 10 min
Deploy Vercel          → 8 min
Test & verify          → 5 min
────────────────────────────
Total                  → 31 min
```

---

## Post-Deployment

```
[ ] Monitor Render logs (daily)
[ ] Check Vercel deployments (weekly)
[ ] Test login flow (weekly)
[ ] Backup MongoDB (monthly)
[ ] Review costs (monthly)
[ ] Update secrets (quarterly)
```

---

## Security Reminders

```
✅ DO:
  - Use strong random secrets (32+ chars)
  - Store secrets in env vars (not code)
  - Enable HTTPS (automatic)
  - Rotate secrets periodically
  - Monitor logs regularly

❌ DON'T:
  - Commit .env to Git
  - Share secrets on Slack/Discord
  - Use simple passwords
  - Use production keys for testing
  - Hardcode URLs
```

---

**Print this card and keep it handy! 📋**

Questions? See the detailed guides in the repo.
