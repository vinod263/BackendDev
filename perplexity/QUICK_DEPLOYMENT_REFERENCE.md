# 🚀 DEPLOYMENT QUICK REFERENCE

## Before Deployment Checklist

### Local Testing (Do This First!)
```bash
# 1. Set up local environment
setup-local.bat  # Windows
./setup-local.sh # Linux/Mac

# 2. Start backend
cd backend && npm run dev

# 3. Start frontend (in new terminal)
cd frontend && npm run dev

# 4. Test on http://localhost:5173
# - Register new account
# - Login
# - Send message
# - If working, proceed to step below
```

---

## Environment Variables Required

### Backend (.env)
```
✓ PORT=3000
✓ ORIGIN_URL=<YOUR_FRONTEND_URL>
✓ MONGO_URI=<YOUR_MONGODB_URL>
✓ JWT_SECRET=<STRONG_RANDOM_SECRET>
✓ GOOGLE_CLIENT_ID=<from .env>
✓ GOOGLE_CLIENT_SECRET=<from .env>
✓ GOOGLE_REFRESH_TOKEN=<from .env>
✓ GOOGLE_USER=<from .env>
✓ GEMINI_API_KEY=<from .env>
✓ MISTRAL_API_KEY=<from .env>
```

### Frontend (.env.local)
```
✓ VITE_API_URL=<YOUR_BACKEND_URL>
```

---

## Deployment Platforms (Easiest → Hardest)

### 1️⃣ Render.com (Easiest - Recommended)
```
Frontend: Deploy from GitHub → Static Site
Backend: Deploy from GitHub → Web Service
Cost: Free tier available
Time: 5 minutes per service
```

### 2️⃣ Vercel (Frontend) + Railway/Render (Backend)
```
Frontend: Push → Automatic deployment
Backend: Connect → Automatic deployment
Cost: Free tier available
Time: 10 minutes total
```

### 3️⃣ VPS (DigitalOcean/Linode)
```
Setup: $5-10/month
Time: 30-45 minutes
Benefits: Full control
```

---

## API Fixes Already Applied ✅

- [x] CORS now uses `process.env.ORIGIN_URL`
- [x] Frontend Axios uses `import.meta.env.VITE_API_URL`
- [x] Socket.io client uses dynamic URL
- [x] Socket.io server uses `process.env.ORIGIN_URL`
- [x] Created `.env.example` templates
- [x] Created `.gitignore` files
- [x] Created setup scripts

---

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| CORS Error | Verify ORIGIN_URL matches frontend domain |
| 404 on API calls | Check VITE_API_URL in frontend .env.local |
| Socket.io won't connect | Check both CORS origins match |
| Auth doesn't persist | Ensure `withCredentials: true` everywhere |
| MongoDB connection fails | Verify MONGO_URI and IP whitelist |
| Blank frontend page | Check dist/ folder exists after build |

---

## Step-by-Step Deployment (Render.com)

### Step 1: Frontend on Render
```
1. Go to render.com → Create New → Static Site
2. Connect GitHub
3. Build: npm run build
4. Dir: dist
5. Add env: VITE_API_URL=https://your-backend.onrender.com
6. Deploy
```

### Step 2: Backend on Render
```
1. Create New → Web Service
2. Connect GitHub (same repo)
3. Build: npm install
4. Start: node server.js
5. Add all env variables from Step 3 below
6. Deploy
```

### Step 3: Get Backend URL
```
Once backend deploys → Note URL (e.g., https://api-xyz.onrender.com)
Update frontend env: VITE_API_URL=https://api-xyz.onrender.com
Redeploy frontend
```

### Step 4: Test
```
1. Visit frontend URL
2. Register/Login
3. Send a message
4. Check browser console (F12) - should see no errors
5. Done! 🎉
```

---

## Monitoring After Deployment

```bash
# Keep an eye on:
- CPU usage
- Memory usage
- Error logs
- Failed API requests
- Database performance

# Set up alerts for:
- Server down
- High error rate
- Database connection issues
```

---

## Security Checklist

- [ ] `.env` file NOT committed to git
- [ ] JWT_SECRET is strong and random
- [ ] HTTPS/SSL enabled
- [ ] MongoDB IP whitelist (not 0.0.0.0/0)
- [ ] Hide API keys from frontend
- [ ] Enable rate limiting
- [ ] Regular backups enabled

---

## When Something Goes Wrong

1. Check backend logs: `pm2 logs` or platform logs
2. Check frontend console: F12 → Console tab
3. Test API directly: `curl https://your-backend/`
4. Verify environment variables: Check platform dashboard
5. Restart services
6. Check network connectivity
7. Read DEPLOYMENT_GUIDE.md for detailed solutions

---

## Files Modified For You

✅ [backend/src/app.js](../backend/src/app.js)
✅ [backend/src/sockets/server.socket.js](../backend/src/sockets/server.socket.js)
✅ [frontend/src/features/auth/service/auth.api.js](../frontend/src/features/auth/service/auth.api.js)
✅ [frontend/src/features/chat/service/chat.api.js](../frontend/src/features/chat/service/chat.api.js)
✅ [frontend/src/features/chat/service/chat.socket.js](../frontend/src/features/chat/service/chat.socket.js)

---

**Next Step:** Run setup-local.bat (or setup-local.sh) to test locally before deploying!
