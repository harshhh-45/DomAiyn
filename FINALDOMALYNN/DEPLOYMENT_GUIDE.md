# DomAIyn Labs Website - Deployment Guide

## 📦 Production Build Created

Your website has been successfully built and is ready for deployment!

**Build Location**: `./dist`

---

## 🚀 Deployment Options (Drag & Drop)

### Option 1: Vercel (Recommended)
**Free tier with custom domain support**

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub, GitLab, or Bitbucket
3. Click **"Add New..."** → **"Project"**
4. Drag and drop the entire `dist` folder
5. Your site will be live in seconds!
6. Custom domain: Go to Settings → Domains

**Features:**
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free custom domain
- ✅ Instant deployments

---

### Option 2: Cloudflare Pages
**Free with unlimited bandwidth**

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up/Login
3. Click **"Create a project"** → **"Direct Upload"**
4. Drag and drop the `dist` folder
5. Click **"Deploy site"**

**Features:**
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free custom domain

---

### Option 3: GitHub Pages
**Free hosting with GitHub**

1. Create a new GitHub repository
2. Upload the contents of the `dist` folder to the repository
3. Go to Settings → Pages
4. Select branch and `/root` folder
5. Click Save

**Features:**
- ✅ Free hosting
- ✅ Custom domain support
- ✅ HTTPS included

---

### Option 4: Firebase Hosting
**Google's hosting platform**

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase login`
3. Run: `firebase init hosting`
   - Select "Use an existing project" or create new
   - Set public directory to: `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html
4. Run: `firebase deploy`

**Features:**
- ✅ Google infrastructure
- ✅ Free SSL
- ✅ Custom domain
- ✅ Fast global CDN

---

### Option 5: Surge.sh
**Simple static hosting**

1. Install Surge: `npm install -g surge`
3. Run: `surge dist`
4. Follow prompts to create account and choose domain

**Features:**
- ✅ Super simple
- ✅ Free subdomain
- ✅ Custom domain (paid)
- ✅ HTTPS

---

## 📁 What's in the `dist` folder?

```
dist/
├── assets/           # Optimized JS, CSS, and images
├── index.html        # Main HTML file
├── logo.jpg          # Logo image
├── logo.png          # Logo image
├── molecule.png      # Molecule graphic
└── spherical-logo.png # 3D logo
```

---

## ⚙️ Build Configuration

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js / React Three Fiber
- **Animations**: Framer Motion
- **Build Tool**: Vite

---

## 🔄 Updating Your Website

Whenever you make changes:

1. Run: `npm run build`
2. Upload the new `dist` folder to your hosting platform
3. Changes will be live immediately!

---

## 🌐 Custom Domain Setup

### For Vercel/Cloudflare:
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update your domain's DNS records as instructed

### DNS Records (typical):
```
Type: A
Name: @
Value: [Provided by hosting platform]

Type: CNAME
Name: www
Value: [Provided by hosting platform]
```

---

## ✅ Pre-Deployment Checklist

- [x] Production build created
- [x] All assets optimized
- [x] Responsive design tested
- [x] 3D animations working
- [x] Navigation functional
- [x] Contact information updated
- [x] SEO meta tags included

---

## 🎯 Recommended: Vercel

**Why Vercel?**
- Easiest drag-and-drop deployment
- Automatic HTTPS and CDN
- Free custom domain
- Zero configuration needed
- Perfect for React/Vite projects

**Quick Start:**
1. Visit [vercel.com](https://vercel.com)
2. Drag `dist` folder
3. Done! 🚀

---

## 📞 Support

If you need help with deployment:
- Vercel Docs: https://vercel.com/docs
- Cloudflare Pages: https://developers.cloudflare.com/pages
- Firebase Hosting: https://firebase.google.com/docs/hosting

---

## 🎨 Your Website Features

✨ **Hero Section**: Centered text with glowing 3D logo
✨ **About Section**: Clean, minimal design
✨ **Bayora Section**: Centered glowing molecule with surrounding text
✨ **Contact Section**: London office details
✨ **Responsive**: Works perfectly on all devices
✨ **Animations**: Smooth Framer Motion transitions
✨ **3D Graphics**: Interactive Three.js visualizations

---

**Your website is ready to go live! 🎉**
