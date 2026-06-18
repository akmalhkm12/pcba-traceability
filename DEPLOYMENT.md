# Deployment Guide - PCBA Traceability System

This guide will help you deploy your PCBA Traceability System to the cloud so everyone can access it from their own laptops anywhere.

## Overview

We'll use:
- **GitHub** - To host your code
- **Render.com** - For backend (FREE, no credit card required)
- **Vercel** - For frontend (FREE, very easy)

Total time: 20-30 minutes

---

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Click "Sign up"
3. Follow the registration steps
4. Verify your email

---

## Step 2: Upload Your Code to GitHub

### Option A: Using GitHub Desktop (Easiest)

1. Download and install GitHub Desktop: https://desktop.github.com
2. Open GitHub Desktop
3. Click "File" → "Add local repository"
4. Browse to `C:\Users\arusdi\pcba-traceability`
5. Click "Create Repository" if prompted
6. Click "Publish repository"
7. Uncheck "Keep this code private" (or keep it private, your choice)
8. Click "Publish Repository"

### Option B: Using Command Line

```bash
cd C:\Users\arusdi\pcba-traceability
git init
git add .
git commit -m "Initial commit - PCBA Traceability System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pcba-traceability.git
git push -u origin main
```

---

## Step 3: Deploy Backend to Render.com

### 3.1 Create Render Account

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (easiest)
4. Verify your email

### 3.2 Create a New Web Service

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository:
   - Click "Connect account" if needed
   - Find and select `pcba-traceability` repository
   - Click "Connect"

### 3.3 Configure the Service

Fill in these settings:

- **Name**: `pcba-backend` (or any name you like)
- **Region**: Choose closest to your location
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 3.4 Add Environment Variables

Scroll down to "Environment Variables" section and add:

- Key: `FRONTEND_URL`
- Value: `*` (we'll update this later)

### 3.5 Deploy

1. Click "Create Web Service"
2. Wait 2-5 minutes for deployment
3. Once it says "Live", copy the URL (looks like: `https://pcba-backend-xxxx.onrender.com`)
4. **SAVE THIS URL** - you'll need it for the frontend!

### 3.6 Test Your Backend

Open your backend URL in a browser and add `/api/statistics`:
```
https://YOUR-BACKEND-URL.onrender.com/api/statistics
```

You should see: `{"total":0,"passed":0,"failed":0,"pending":0}`

✓ Backend is deployed!

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub" (easiest)
4. Authorize Vercel to access your GitHub

### 4.2 Import Your Project

1. Click "Add New..." → "Project"
2. Find your `pcba-traceability` repository
3. Click "Import"

### 4.3 Configure the Project

- **Framework Preset**: Create React App (should auto-detect)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `build` (should be auto-filled)

### 4.4 Add Environment Variable

Click "Environment Variables" and add:

- **Name**: `REACT_APP_API_URL`
- **Value**: `https://YOUR-BACKEND-URL.onrender.com/api`

  Replace `YOUR-BACKEND-URL` with the URL from Step 3.5

  Example: `https://pcba-backend-xxxx.onrender.com/api`

### 4.5 Deploy

1. Click "Deploy"
2. Wait 1-2 minutes for build and deployment
3. Once complete, click "Visit" or copy the URL
4. **SAVE THIS URL** - this is your public app URL!

---

## Step 5: Update Backend CORS

Now go back to Render.com and update the backend's FRONTEND_URL:

1. Open Render dashboard
2. Click on your `pcba-backend` service
3. Go to "Environment" tab
4. Edit `FRONTEND_URL` variable
5. Change value from `*` to your Vercel URL: `https://your-app.vercel.app`
6. Click "Save Changes"
7. The service will automatically redeploy (takes ~1 minute)

---

## Step 6: Test Everything

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Try creating a PCBA
3. Record an assembly step
4. Record a test result
5. View the dashboard

✓ Everything works!

---

## Share With Your Team

**Your public URL**: `https://your-app.vercel.app`

Send this link to your team. Anyone can:
- Access it from any device (laptop, tablet, phone)
- Create and track PCBAs
- Record assembly and test data
- View reports and statistics

---

## Important Notes

### Free Tier Limitations

**Render (Backend):**
- Goes to sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (enough for 24/7 for one service)
- Database resets if you redeploy (unless you add persistent disk)

**Vercel (Frontend):**
- 100GB bandwidth/month
- Unlimited websites
- Always fast, no sleeping

### Data Persistence

Currently, your database will be lost if the backend restarts on Render. To fix this:

**Option 1: Add Persistent Disk (Render Free Tier)**
1. Go to Render dashboard → your service
2. Click "Disks" → "Add Disk"
3. Name: `database`
4. Mount Path: `/opt/render/project/src/backend`
5. Size: 1GB (free)
6. Click "Save"

**Option 2: Upgrade to Paid Plan ($7/month)**
- Persistent disk included
- No sleeping
- Faster performance

---

## Updating Your Application

When you make changes to the code:

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

2. **Both Render and Vercel will automatically redeploy!**
3. Wait 2-5 minutes for deployment
4. Refresh your browser

---

## Troubleshooting

### Backend not responding
- Check if backend is sleeping (first request takes longer)
- Check Render logs for errors
- Verify environment variables are set

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` is correct in Vercel
- Check CORS settings in Render (FRONTEND_URL)
- Check backend is deployed and "Live"

### Data lost after restart
- Add persistent disk to Render (see Data Persistence section)
- Or upgrade to paid plan

---

## Need Help?

If you encounter issues:
1. Check the Render logs (Render dashboard → your service → "Logs")
2. Check the browser console (F12 → Console tab)
3. Verify all environment variables are set correctly

---

## Summary

✓ Backend deployed to Render
✓ Frontend deployed to Vercel
✓ Database persists (with disk or paid plan)
✓ Accessible from anywhere
✓ Auto-deploys when you push to GitHub

Your team can now access the system from any device, anywhere in the world!
