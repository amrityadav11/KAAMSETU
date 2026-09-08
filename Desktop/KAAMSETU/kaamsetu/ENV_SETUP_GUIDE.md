# Environment Variables Setup Guide

This guide shows how to get and configure all required environment variables.

---

## 1. MongoDB Atlas (MONGO_URI)

### Get Your MongoDB Connection String

**Step 1: Create MongoDB Account**
- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Click **Sign Up** (or log in)

**Step 2: Create Cluster**
- Click **Create** → Select **Free M0** cluster
- Choose region closest to you (e.g., `ap-south-1` for India)
- Click **Create Cluster** (wait 5-10 min)

**Step 3: Create Database User**
- In left sidebar, click **Database Access**
- Click **Add New Database User**
- **Username:** `kaamsetu_user`
- **Password:** Generate and save securely (e.g., use [lastpass.com](https://lastpass.com))
- Click **Add User**

**Step 4: Whitelist IP**
- Left sidebar → **Network Access**
- Click **Add IP Address**
- Enter: `0.0.0.0/0` (allows all IPs — safe for Render)
- Click **Confirm**

**Step 5: Get Connection String**
- Go back to **Clusters** → Click **Connect**
- Choose **Connect your application**
- Copy the connection string
- Replace `<username>` with `kaamsetu_user`
- Replace `<password>` with your password from Step 3

**Result:**
```
mongodb+srv://kaamsetu_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kaamsetu?retryWrites=true&w=majority
```

---

## 2. JWT Secrets (JWT_SECRET, COOKIE_SECRET)

### Generate Secure Random Strings

Use one of these methods:

**Option A: Terminal (PowerShell)**
```powershell
# Generate 32-character random string
-join ((33..126) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Option B: Online Generator**
- Go to [1password.com/password-generator](https://1password.com/password-generator)
- Set length to **32** characters
- Generate and copy

**Option C: Node.js**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

**Result Examples:**
```
JWT_SECRET=a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6qR7s8T9u
COOKIE_SECRET=x9Y8z7A6b5C4d3E2f1G0h9I8j7K6l5M4n3O2p1Q0r
```

---

## 3. Cloudinary (Image Uploads)

### Get Cloudinary API Credentials

**Step 1: Create Account**
- Go to [cloudinary.com](https://cloudinary.com)
- Sign up (free tier includes 25GB/year)

**Step 2: Find Your Credentials**
- Dashboard shows:
  - **Cloud Name:** `YOUR_CLOUD_NAME` (e.g., `dx7xyz123`)
  - **API Key:** `YOUR_API_KEY` (e.g., `123456789`)
  - **API Secret:** Click to reveal

**Step 3: Get Full Details**
- Click on your profile (top-right)
- Go to **Settings**
- Click **API Keys**
- Copy:
  - Cloud Name
  - API Key
  - API Secret

**Result:**
```
CLOUDINARY_CLOUD_NAME=dx7xyz123
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc123def456
```

---

## 4. Razorpay (Payments)

### Get Razorpay Test Keys

**Step 1: Create Account**
- Go to [razorpay.com](https://razorpay.com)
- Sign up

**Step 2: Switch to Test Mode**
- Dashboard → Top-right, toggle to **Test Mode**

**Step 3: Get Test Keys**
- Go to **Settings** → **API Keys**
- You'll see:
  - **Key ID:** `rzp_test_xxxxxxxxxx`
  - **Key Secret:** (click eye icon to reveal)

**Step 4: For Production (Later)**
- Switch to **Live Mode** in dashboard
- Get Live keys
- Update in Render env vars

**Test Payment Details** (use for testing):
```
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Date: Any future date
```

**Result:**
```
RAZORPAY_KEY_ID=rzp_test_123abc456def
RAZORPAY_KEY_SECRET=your_test_secret_key
```

---

## 5. Configure Local .env File

### Create `server/.env`

```bash
# Copy the example file
cp server/.env.example server/.env

# Open in VS Code and fill in:
```

**server/.env:**
```env
# MongoDB
MONGO_URI=mongodb+srv://kaamsetu_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kaamsetu?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_random_32_char_secret_here
JWT_EXPIRES_IN=7d

# Client URL (development)
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret

# Node
NODE_ENV=development
PORT=5001

# Cookie
COOKIE_SECRET=another_random_32_char_secret
```

---

## 6. Configure Render Environment Variables

### When Deploying Backend

Go to Render → Your Service → **Environment**

Add these variables:

```
MONGO_URI=mongodb+srv://kaamsetu_user:PASSWORD@cluster0.xxxxx.mongodb.net/kaamsetu?retryWrites=true&w=majority
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://kaamsetu.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
NODE_ENV=production
PORT=5001
COOKIE_SECRET=your_random_secret
```

**⚠️ Important:** 
- Use `https://kaamsetu.vercel.app` for `CLIENT_URL` (not localhost!)
- Generate new secrets for production (don't reuse local ones)

---

## 7. Configure Vercel Environment Variables

### When Deploying Frontend

Go to Vercel → Project → **Settings** → **Environment Variables**

Add:

```
VITE_API_URL=https://kaamsetu-api.onrender.com
```

Replace with your actual Render backend URL.

---

## 8. Quick Validation Checklist

Before deploying, verify all values:

```
□ MONGO_URI connects (test with MongoDB Atlas UI)
□ JWT_SECRET is 32+ characters
□ COOKIE_SECRET is 32+ characters
□ CLOUDINARY_CLOUD_NAME is not empty
□ CLOUDINARY_API_KEY is not empty
□ CLOUDINARY_API_SECRET is not empty
□ RAZORPAY_KEY_ID starts with rzp_test_ (or rzp_live_)
□ RAZORPAY_KEY_SECRET is not empty
□ CLIENT_URL uses https:// (not http://)
□ NODE_ENV=production (for Render)
□ No localhost URLs on production services
```

---

## 9. Security Notes

**Do:**
- ✅ Use strong random secrets (32+ characters)
- ✅ Never commit `.env` to GitHub
- ✅ Use environment variables on deployment platforms
- ✅ Rotate secrets if compromised

**Don't:**
- ❌ Share secrets in Slack, email, or Discord
- ❌ Commit `.env` file to git
- ❌ Use simple passwords (e.g., "123456")
- ❌ Use production API keys for local testing

---

## 10. Troubleshooting

| Problem | Solution |
|---|---|
| **MongoDB connection fails** | Check MONGO_URI in .env, test in MongoDB Atlas dashboard |
| **Cloudinary upload fails** | Verify CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET |
| **Razorpay payment errors** | Make sure using `rzp_test_` keys (not live) for testing |
| **CORS errors** | Check CLIENT_URL matches frontend domain |
| **Blank environment values** | Verify all vars are set (no typos in names) |

---

## Reference: All Environment Variables

| Variable | Format | Example | Where to Get |
|---|---|---|---|
| `MONGO_URI` | Connection string | `mongodb+srv://...` | MongoDB Atlas |
| `JWT_SECRET` | Random 32+ chars | `a1B2c3D4e5F6g7H8...` | Generate |
| `JWT_EXPIRES_IN` | Duration | `7d` | Fixed value |
| `CLIENT_URL` | URL | `https://kaamsetu.vercel.app` | Vercel |
| `CLOUDINARY_CLOUD_NAME` | Text | `dx7xyz123` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Numbers | `123456789` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Text | `abc123def456` | Cloudinary Dashboard |
| `RAZORPAY_KEY_ID` | ID | `rzp_test_xxxxx` | Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | Text | `secret123` | Razorpay Dashboard |
| `NODE_ENV` | `development` or `production` | `production` | You choose |
| `PORT` | Number | `5001` | Fixed value |
| `COOKIE_SECRET` | Random 32+ chars | `x9Y8z7A6b5C4d3E2...` | Generate |

---

**Done!** You're ready to deploy. 🚀

Next: See `QUICK_DEPLOY_STEPS.md` for step-by-step deployment.
