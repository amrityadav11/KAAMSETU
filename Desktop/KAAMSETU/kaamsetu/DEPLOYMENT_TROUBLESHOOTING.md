# Deployment Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Critical Issues

### 1. "502 Bad Gateway" on Vercel

**What it means:** Vercel can't reach your Render backend.

**Solutions:**

1. **Check Render is running**
   - Go to Render dashboard
   - Click your service
   - Check **Status** shows "Live"

2. **Check backend URL**
   ```
   1. Go to Vercel → Project Settings → Environment
   2. Find VITE_API_URL variable
   3. Copy the value
   4. Paste in browser: https://your-api-url/api/health
   5. Should return JSON (not error)
   ```

3. **If backend is sleeping (free tier)**
   - Render free tier spins down after 15 min
   - Solution: 
     - Upgrade to **Starter** ($7/mo)
     - OR use a ping service like [kping.app](https://kping.app)

4. **Check CORS settings**
   - Render backend needs to know Vercel domain
   - Verify `CLIENT_URL` env var on Render is correct
   - Redeploy Render service

---

### 2. CORS Error: "Not allowed by CORS"

**Browser shows:**
```
Access to XMLHttpRequest at 'https://kaamsetu-api.onrender.com/api/...' 
from origin 'https://kaamsetu.vercel.app' has been blocked by CORS policy
```

**Root cause:** Backend doesn't recognize your Vercel domain.

**Solutions:**

**Step 1: Verify Render env variables**
```
1. Go to Render dashboard → Your service
2. Go to Environment
3. Find: CLIENT_URL
4. Should be: https://kaamsetu.vercel.app
5. If wrong, fix it and redeploy
```

**Step 2: Verify backend code**
```
1. Check server/server.js line ~40
2. Make sure *.vercel.app is in allowedOrigins
3. If missing, add it:
   'https://*.vercel.app'
4. Commit and push to GitHub
5. Render auto-deploys
```

**Step 3: Test with curl**
```bash
# Should return 200
curl -X GET https://kaamsetu-api.onrender.com/api/health

# If 403 or error, backend is having issues
```

---

### 3. MongoDB Connection Failed

**Error in Render logs:**
```
MongoDB connection error: connect ENOTFOUND
```

**Solutions:**

**Step 1: Verify connection string**
```
1. Render → Environment
2. Find MONGO_URI
3. Should look like:
   mongodb+srv://kaamsetu_user:PASSWORD@cluster0.xxxxx.mongodb.net/kaamsetu?retryWrites=true&w=majority
4. Replace PASSWORD with actual password
```

**Step 2: Verify MongoDB Atlas IP whitelist**
```
1. Go to MongoDB Atlas → Network Access
2. Should see: 0.0.0.0/0 (allow all IPs)
3. If not there, add it:
   - Click "Add IP Address"
   - Enter: 0.0.0.0/0
   - Confirm
```

**Step 3: Test locally**
```bash
# Try connecting from your machine
cd server
npm run dev

# Should show: MongoDB Connected: localhost
```

**Step 4: Create database user if missing**
```
1. MongoDB Atlas → Database Access
2. Should have user: kaamsetu_user
3. If missing, create it:
   - Click "Add New Database User"
   - Username: kaamsetu_user
   - Generate password
   - Add User
```

---

### 4. "Cannot read properties of undefined"

**Browser shows:**
```
TypeError: Cannot read properties of undefined (reading 'data')
```

**Common cause:** API response is undefined (bad URL or no response).

**Solutions:**

**Check VITE_API_URL on Vercel:**
```
1. Vercel Dashboard → Project
2. Go to Environment Variables
3. Find: VITE_API_URL
4. Should match your Render URL: https://kaamsetu-api.onrender.com
5. If missing or wrong:
   - Add/fix it
   - Redeploy project (click "Redeploy")
```

**Test API directly:**
```bash
# In browser DevTools Console:
fetch('https://kaamsetu-api.onrender.com/api/auth/me', {
  headers: {'Authorization': 'Bearer yourtoken'}
}).then(r => r.json()).then(console.log)

# Should show user data (not error)
```

---

## 🟡 Warning Issues

### 5. Login Always Fails

**What happens:** Enter credentials, page doesn't respond, no error.

**Likely causes:**
1. Backend API not reachable
2. Database connection failed
3. JWT secrets don't match

**Debug:**

**Step 1: Check backend logs**
```
1. Render dashboard → Your service
2. Click "Logs"
3. Scroll down looking for errors
4. Common: "MongoDB connection error"
```

**Step 2: Test API directly**
```bash
# In browser DevTools Console:
const res = await fetch('https://kaamsetu-api.onrender.com/api/health');
const data = await res.json();
console.log(data);

# Should show success message
```

**Step 3: Check JWT_SECRET**
```
1. Make sure JWT_SECRET is set on Render
2. Make sure it's the same for all deployments
3. If changed, redeploy backend
```

---

### 6. Free Tier Spinning Down

**What it means:** Render free tier stops running after 15 minutes of no traffic.

**Symptoms:**
- App works fine at first
- After 15+ min of inactivity, returns 502
- Works again after 30-60 sec (waking up)

**Solutions:**

**Option A: Upgrade to Starter ($7/month)**
```
1. Render dashboard → Your service
2. Go to Settings
3. Click "Change Plan"
4. Select "Starter" ($7/month)
5. Confirm
```

**Option B: Use a ping service (free)**
```
1. Go to https://kping.app
2. Enter your API URL: https://kaamsetu-api.onrender.com/api/health
3. Interval: 25 minutes
4. Keep alive!
```

---

### 7. Blank White Page After Login

**What happens:** Login succeeds, but dashboard shows nothing.

**Solutions:**

**Step 1: Hard refresh browser**
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

**Step 2: Check browser console**
```
1. Press F12
2. Go to "Console" tab
3. Look for red errors
4. Check "Network" tab for 404s
```

**Step 3: Check if you're logged in**
```
DevTools Console:
localStorage.getItem('kaamsetu_token')

Should return a token string, not null
```

**Step 4: Verify dashboard routes**
```
Try manually visiting:
https://kaamsetu.vercel.app/dashboard

Should load dashboard page
```

---

## 🟢 Minor Issues

### 8. Images Not Loading

**What it means:** Gallery, logo, cover images show broken link icon.

**Solutions:**

**Check Cloudinary credentials:**
```
1. Render → Environment Variables
2. Verify these are set:
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
3. If missing, add them
4. Redeploy
```

**Test Cloudinary upload:**
```
1. Login to KaamSetu
2. Go to MyBusiness
3. Try uploading a logo
4. Should work without errors
```

---

### 9. QR Codes Not Generating

**Error:** "Failed to generate QR code" when publishing business.

**Solutions:**

**Check qrcode npm is installed:**
```bash
cd server
npm ls qrcode

# Should show version (e.g., 1.5.3)
# If missing: npm install qrcode
```

**Verify in Render build:**
```
1. Render → Logs
2. Look at build output
3. Should show: npm install
4. Then: npm ls (showing qrcode installed)
```

---

### 10. Razorpay Payment Test Fails

**When:** Clicking "Subscribe" → Razorpay popup not opening.

**Solutions:**

**Check test keys are set:**
```
1. Render → Environment
2. Verify:
   RAZORPAY_KEY_ID=rzp_test_xxxxx (starts with rzp_test_)
   RAZORPAY_KEY_SECRET=your_secret
3. If live keys are used in test, it will fail
```

**Use test payment details:**
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

**If still fails:**
```
1. Check Render logs for errors
2. Verify Razorpay account is in test mode
3. Check API keys on Razorpay dashboard
```

---

## 🔍 Diagnostic Commands

### Test Backend Health
```bash
# Should return 200 with JSON
curl https://kaamsetu-api.onrender.com/api/health
```

### Test Database Connection
```bash
# From server directory with .env
npm run dev
# Should show: MongoDB Connected: [hostname]
```

### Test API Authentication
```bash
# Get token (if have account)
curl -X POST https://kaamsetu-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@kaamsetu.in","password":"Demo@1234"}'

# Should return token in response
```

### View Render Logs
```
1. Render dashboard
2. Click your service
3. Click "Logs" tab
4. Scroll to see errors/info
```

### View Vercel Build Logs
```
1. Vercel dashboard
2. Select project
3. Click "Deployments"
4. Click a deployment
5. View build logs
```

---

## ❌ Deployment Mistakes to Avoid

| Mistake | Why Bad | How to Fix |
|---|---|---|
| Using localhost in CLIENT_URL | Backend won't accept Vercel requests | Use actual Vercel domain URL |
| Forgetting VITE_API_URL on Vercel | Frontend can't find backend | Add env var, redeploy |
| Committing `.env` to GitHub | Exposes secrets publicly | Use .gitignore, regenerate keys |
| Using free Render forever | Gets 502s after 15 min | Upgrade to Starter ($7) |
| Wrong MongoDB credentials | Can't connect to database | Verify username/password/URI |
| Not whitelisting IPs on MongoDB | Atlas blocks connections | Add 0.0.0.0/0 to Network Access |
| Mixing test and live Razorpay keys | Payment flow breaks | Use rzp_test_ for dev, rzp_live_ for prod |
| Not updating CORS for new domain | CORS blocks requests | Update CLIENT_URL on Render |

---

## 📝 Pre-Flight Checklist

Before saying "it's ready", verify:

```
□ Backend accessible at https://your-backend-url/api/health
□ Frontend loads at https://your-frontend-url without errors
□ Can login with test credentials
□ Can navigate to dashboard
□ Can create a business
□ Can upload images (logo, cover, gallery)
□ Can add services and products
□ Can publish business and see public page
□ QR code generates and downloads
□ Analytics page loads with charts
□ Can submit enquiry form from public page
□ Razorpay payment flow opens (with test keys)
□ No red errors in browser console (F12)
□ No 404s in Network tab (F12)
□ Mobile layout looks decent (resize browser to 390px)
```

---

## Getting Help

### Check Logs First
1. **Render logs** — Shows backend errors
2. **Vercel logs** — Shows frontend build errors
3. **Browser Console** — Shows JavaScript errors (F12)
4. **Network tab** — Shows failed API requests (F12)

### Common Log Locations
```
Render backend logs:
  Dashboard → Service → Logs

Vercel frontend logs:
  Dashboard → Project → Deployments → [latest] → Logs

Browser console:
  F12 → Console tab

Network requests:
  F12 → Network tab
```

---

## Quick Reference: What to Do When

| Situation | Action |
|---|---|
| **Can't log in** | Check Render logs + MongoDB connection |
| **Blank white page** | Hard refresh (Ctrl+Shift+R) + check console (F12) |
| **502 error** | Backend sleeping? Upgrade Render tier |
| **CORS error** | Verify CLIENT_URL on Render + VITE_API_URL on Vercel |
| **Images not loading** | Check Cloudinary credentials on Render |
| **Payment won't open** | Verify Razorpay test keys on Render |

---

**Still stuck? Check the detailed guides:**
- `DEPLOYMENT_VERCEL_RENDER.md` — Full setup guide
- `ENV_SETUP_GUIDE.md` — How to get credentials
- `QUICK_DEPLOY_STEPS.md` — Step-by-step checklist
