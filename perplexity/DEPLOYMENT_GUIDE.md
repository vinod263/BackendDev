# 🚀 DEPLOYMENT GUIDE - Perplexity Chat Application

## Overview
This guide covers deploying your full-stack application (Express + React + MongoDB + Socket.io) to production without API issues.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Backend Configuration
- [ ] Copy `.env.example` to `.env` in the backend folder
- [ ] Update `MONGO_URI` with your MongoDB Atlas production database
- [ ] Update `JWT_SECRET` with a strong random secret
- [ ] Update `ORIGIN_URL` to your frontend's production URL
- [ ] Verify all API keys are valid (Gemini, Mistral, Google OAuth)
- [ ] Install all dependencies: `npm install`

### Frontend Configuration  
- [ ] Create `.env.local` in the frontend folder
- [ ] Set `VITE_API_URL` to your backend's production URL
- [ ] Install all dependencies: `npm install`
- [ ] Test build locally: `npm run build`
- [ ] Verify build output in `dist/` folder

---

## 🔧 LOCAL DEVELOPMENT (Testing Before Deployment)

### 1. Start MongoDB Instance
```bash
# If using MongoDB Atlas, connection string is in backend/.env
# If using local MongoDB, ensure mongod is running
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
# Server should run on http://localhost:3000
```

### 3. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
# Server should run on http://localhost:5173
```

### 4. Test API Connections
```bash
# Test backend is running
curl http://localhost:3000

# Test CORS and authentication
curl -c cookies.txt -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Open http://localhost:5173 in browser
# Login and test chat functionality
```

---

## ☁️ DEPLOYMENT OPTIONS

### Option 1: Deploy on Render.com (Recommended for Beginners)

#### Frontend Deployment (Static Site)
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create New > Static Site
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Add Environment Variables:
   - `VITE_API_URL=https://your-backend-url.onrender.com`
7. Deploy

#### Backend Deployment
1. Create New > Web Service
2. Connect your repository
3. Environment: Node.js
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   ```
   PORT=3000
   ORIGIN_URL=https://your-frontend-url.onrender.com
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=strong-random-secret
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REFRESH_TOKEN=...
   GOOGLE_USER=...
   GEMINI_API_KEY=...
   MISTRAL_API_KEY=...
   ```
7. Deploy

---

### Option 2: Deploy on Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) > Import Project
3. Select your repository
4. Framework: Vite
5. Build Command: `npm run build`
6. Environment Variables:
   - `VITE_API_URL=https://your-railway-backend.com`
7. Deploy

#### Backend on Railway
1. Go to [railway.app](https://railway.app)
2. Create New Project
3. Deploy from GitHub repo
4. Variables tab - add all environment variables (see above)
5. Point your domain

---

### Option 3: Deploy on VPS (DigitalOcean, Linode, AWS EC2)

#### Setup Server
```bash
# SSH into your server
ssh root@your_server_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (or use MongoDB Atlas)
sudo apt-get install -y mongodb

# Install PM2 for process management
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/your-user/your-repo.git
cd your-repo
```

#### Deploy Backend
```bash
cd backend
npm install

# Create .env file
nano .env
# Paste your environment variables

# Start with PM2
pm2 start server.js --name "perplexity-api"
pm2 save
pm2 startup
```

#### Build and Deploy Frontend
```bash
cd frontend
npm install
npm run build

# Install nginx
sudo apt-get install -y nginx

# Copy build to nginx
sudo cp -r dist/* /var/www/html/

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Setup Domain & SSL
```bash
# Install Certbot for free SSL
sudo apt-get install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Update nginx config to use SSL
sudo nano /etc/nginx/sites-available/default
```

---

## 🐛 COMMON API ISSUES & FIXES

### Issue 1: CORS Error (Frontend can't call Backend)
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Fix:**
1. Verify `ORIGIN_URL` in backend `.env` matches your frontend URL
2. Check backend CORS config uses `process.env.ORIGIN_URL`
3. Verify Socket.io uses `process.env.ORIGIN_URL`
4. Hard reload frontend (Ctrl+Shift+R)

### Issue 2: Frontend Can't Connect to Backend
**Error:** `Cannot GET /api/auth/...` or 404 errors

**Fix:**
1. Verify `VITE_API_URL` in frontend `.env.local`
2. Check backend is running on the correct port
3. Verify API endpoint paths in backend routes
4. Test endpoint: `curl https://your-backend/`

### Issue 3: Socket.io Connection Fails
**Error:** `WebSocket connection broken`, Socket events not firing

**Fix:**
1. Verify both frontend and backend have matching `ORIGIN_URL`/`VITE_API_URL`
2. Check Socket.io initialization is called: `initializeSocketConnection()`
3. Verify `withCredentials: true` is set on both sides
4. Check firewall allows WebSocket connections

### Issue 4: Authentication Not Working
**Error:** `Unauthorized`, tokens not persisting

**Fix:**
1. Verify `JWT_SECRET` is consistent (shouldn't change)
2. Check `withCredentials: true` in Axios and Socket.io
3. Verify cookies are being sent: Check browser DevTools > Application > Cookies
4. Clear browser cache and cookies, restart frontend

### Issue 5: MongoDB Connection Failed
**Error:** `MongooseError: Cannot connect to MongoDB`

**Fix:**
1. Verify `MONGO_URI` is correct in `.env`
2. Check MongoDB Atlas whitelist includes your server IP (0.0.0.0/0 for development)
3. Test connection manually: `node -e "require('mongoose').connect(process.env.MONGO_URI)"`
4. Check network connectivity to MongoDB Atlas

---

## 📝 POST-DEPLOYMENT TESTING

### 1. Test Backend API
```bash
# Health check
curl https://your-backend-url/

# Test authentication flow
curl -X POST https://your-backend-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Login and verify JWT
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  -c cookies.txt

# Get chats (requires auth)
curl https://your-backend-url/api/chats -b cookies.txt
```

### 2. Test Frontend
- Visit your frontend URL
- Test registration/login
- Send a message in chat
- Check browser Console for errors (F12)
- Check Network tab to verify API calls are going to correct URL

### 3. Monitor Logs
```bash
# PM2 logs
pm2 logs perplexity-api

# Docker logs (if using Docker)
docker logs container_name
```

---

## 🔒 SECURITY RECOMMENDATIONS

1. **Never commit `.env` to version control**
   - Add to `.gitignore`: `echo ".env" >> .gitignore`

2. **Use strong JWT_SECRET**
   ```bash
   # Generate random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Set up HTTPS/SSL**
   - Use Let's Encrypt (via Certbot)
   - Or use Render/Vercel auto SSL

4. **Restrict MongoDB access**
   - Use IP whitelist in MongoDB Atlas
   - Don't use 0.0.0.0/0 in production

5. **Rotate API Keys Regularly**
   - Update Gemini, Mistral, Google OAuth keys

6. **Enable Rate Limiting**
   - Install: `npm install express-rate-limit`
   - Add to backend routes to prevent abuse

---

## 📞 TROUBLESHOOTING

| Error | Cause | Solution |
|-------|-------|----------|
| 503 Bad Gateway | Backend down | Restart server, check PM2 logs |
| 404 Not Found | Wrong endpoint | Verify routes in backend |
| Blank white page | Frontend build failed | Check build logs, verify dist/ files |
| Infinite loading | API hanging | Check backend logs, database connection |
| Auth doesn't persist | Credentials mode wrong | Add withCredentials to axios/socket.io |

---

## 📚 Environment Variables Summary

### Backend (.env)
```
PORT
ORIGIN_URL
MONGO_URI
JWT_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
GOOGLE_USER
GEMINI_API_KEY
MISTRAL_API_KEY
```

### Frontend (.env.local)
```
VITE_API_URL
```

---

## ✅ DEPLOYMENT CHECKLIST - FINAL

- [ ] Backend .env configured with production values
- [ ] Frontend .env.local configured with production API URL
- [ ] All dependencies installed in both folders
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts without errors (`npm start`)
- [ ] MongoDB connection works
- [ ] CORS is configured correctly
- [ ] Socket.io connections work
- [ ] Authentication flow tested end-to-end
- [ ] Chat messaging works
- [ ] SSL/HTTPS enabled
- [ ] Monitoring/logging set up
- [ ] Backups configured (for database)
- [ ] Domain DNS configured correctly

---

**You're ready to deploy! 🎉**
