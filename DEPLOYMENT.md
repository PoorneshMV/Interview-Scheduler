# 🚀 Deployment Guide - Make It Live 24/7

Deploy your Interview Scheduler to production with free hosting!

## Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Free tier with generous limits
- Auto-deploy on git push
- Built for Node.js
- Fast CDN globally

### Steps:

1. **Go to Vercel**: https://vercel.com/signup
2. **Sign up** with your GitHub account
3. **Create Project**:
   - Click "Add New..." → Project
   - Import your GitHub repo: `Interview-Scheduler`
   - Framework: Node.js (auto-detected)
4. **Environment Variables** (if needed for API keys):
   - No setup needed for this app (keys are client-side)
5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live! 🎉

**Your live URL**: `https://interview-scheduler-[random].vercel.app`

---

## Option 2: Render

**Why Render?**
- Free tier with auto-sleep (wakes on request)
- Good for Node.js servers
- Simple GitHub integration

### Steps:

1. **Go to Render**: https://render.com/signup
2. **Sign up** with GitHub
3. **New Web Service**:
   - Connect GitHub repo: `Interview-Scheduler`
   - Environment: Node
   - Build command: `npm install`
   - Start command: `npm start`
4. **Deploy**
5. **Your live URL**: `https://interview-scheduler-[random].onrender.com`

---

## Option 3: Railway

**Why Railway?**
- Simple deployment
- Generous free tier
- Good GitHub sync

### Steps:

1. **Go to Railway**: https://railway.app
2. **New Project** → Deploy from GitHub
3. **Select repo**: `Interview-Scheduler`
4. **Create project** (auto-detects Node.js)
5. **Your live URL**: Auto-generated

---

## After Deployment

### Update Your App Links

1. Replace `localhost:3000` with your deployed URL
2. Share the live link
3. Users can access 24/7 without running locally

### Features Available:
✅ Download sample CSV
✅ Upload and process interviews
✅ Send emails via MailerSend
✅ View real-time statistics
✅ Email logging and tracking

---

## Pro Tips

### For Vercel:
- Add custom domain: Go to Settings → Domains
- GitHub auto-deploy: Every push to `main` re-deploys
- Environment variables: Add in Settings → Environment Variables

### For Render:
- Free tier hibernates after 15 min inactivity
- Paid tier ($7/month) keeps it always on
- Auto-redeploy on GitHub push

### For Railway:
- Free $5 monthly credit
- Simple environment variable management
- Great uptime

---

## Troubleshooting

**"Port Error"**
- Vercel/Railway handle ports automatically
- App works with `process.env.PORT || 3000`

**"CSV Download Not Working"**
- Ensure CSV is in `/public` folder ✅ (already done)
- Deploy includes it automatically

**"APIs Failing"**
- Airtable proxy endpoints work from anywhere
- Make sure Airtable token is valid
- MailerSend key must be configured in-app

---

## Recommended: Go with Vercel

Most reliable and fastest setup:
1. Visit https://vercel.com/signup
2. Click "Import Project"
3. Paste: `https://github.com/PoorneshMV/Interview-Scheduler`
4. Click "Deploy"
5. Done! ✨

Your app will be live in minutes, auto-updating on every GitHub push!
