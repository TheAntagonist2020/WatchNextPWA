# Deployment Guide - WatchNext PWA

This guide provides step-by-step instructions for deploying WatchNext PWA so you can access it from any device, including mobile phones and tablets.

**💰 Cost: $0 - Everything here is completely free!**

## Table of Contents
- [GitHub Pages Deployment](#github-pages-deployment) ⭐ **RECOMMENDED - Free & Simple**
- [Netlify Deployment](#netlify-deployment) - Also Free
- [Vercel Deployment](#vercel-deployment) - Also Free
- [Accessing on Mobile](#accessing-on-mobile)
- [Advanced: Custom Domain Setup](#advanced-custom-domain-setup) (Optional - costs money)

---

## GitHub Pages Deployment

**⭐ RECOMMENDED - Completely Free, No Domain Purchase Needed!**

GitHub Pages is the easiest way to deploy if your code is already on GitHub. You get a free URL that works perfectly: `https://yourusername.github.io/WatchNextPWA/`

### Step-by-Step:

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your GitHub repository
   - Click "Settings" tab
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select your branch (usually `main`)
   - Select folder: `/ (root)`
   - Click "Save"

3. **Wait for deployment**:
   - GitHub will show a message: "Your site is ready to be published at..."
   - Wait 1-2 minutes for the build to complete
   - Refresh the page to see the published URL

4. **Your app is live!**
   - URL format: `https://YOUR_USERNAME.github.io/WatchNextPWA/`
   - Example: `https://TheAntagonist2020.github.io/WatchNextPWA/`
   - **This URL is free and permanent - no need to buy a domain!**

### Updating Your Deployment:

Simply push new commits to your repository:
```bash
git add .
git commit -m "Update app"
git push origin main
```

GitHub Pages will automatically redeploy within 1-2 minutes.

---

## Netlify Deployment

Netlify offers automatic deployments with a simple drag-and-drop interface.

### Method 1: Drag & Drop

1. **Visit [Netlify](https://netlify.com)** and sign up (free)
2. **Drag your project folder** to the Netlify drop zone
3. **Wait for deployment** (usually < 1 minute)
4. **Your app is live!**
   - You'll get a URL like: `https://random-name-12345.netlify.app`
   - You can customize this name in site settings

### Method 2: GitHub Integration (Recommended)

1. **Sign up on [Netlify](https://netlify.com)** using your GitHub account
2. **Click "New site from Git"**
3. **Choose GitHub** and authorize Netlify
4. **Select your repository** (WatchNextPWA)
5. **Configure build settings**:
   - Build command: Leave empty (static site)
   - Publish directory: `/` or leave empty
6. **Click "Deploy site"**

Your site will automatically redeploy whenever you push to GitHub!

### Custom Subdomain:

1. Go to Site Settings > Domain Management
2. Click "Options" next to your site name
3. Click "Edit site name"
4. Enter your desired name: `watchnext.netlify.app`

---

## Vercel Deployment

Vercel offers lightning-fast deployments with GitHub integration.

### Step-by-Step:

1. **Visit [Vercel](https://vercel.com)** and sign up (free)
2. **Click "New Project"**
3. **Import your GitHub repository**:
   - Click "Import Git Repository"
   - Select your WatchNextPWA repository
4. **Configure project**:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: Leave empty
   - Output Directory: Leave empty
5. **Click "Deploy"**

Your site will be live in seconds!
- URL format: `https://watch-next-pwa.vercel.app`

### Automatic Updates:

Every push to your GitHub repository will automatically trigger a new deployment.

---

## Accessing on Mobile

Once deployed, here's how to access your PWA on mobile devices:

### Method 1: Type the URL

1. Open Safari (iOS) or Chrome (Android)
2. Type your deployment URL in the address bar
3. Bookmark it for easy access

### Method 2: QR Code (Recommended)

1. **Generate QR Code**:
   - Visit: https://www.qr-code-generator.com/
   - Enter your deployment URL
   - Download the QR code image

2. **Print or display** the QR code on your computer screen

3. **Scan with mobile**:
   - Open Camera app on iPhone
   - Open Chrome or Camera on Android
   - Point at the QR code
   - Tap the notification to open

### Method 3: Share the Link

Send yourself the URL via:
- Email yourself the link
- Text message
- Messaging apps (WhatsApp, Telegram, Signal, etc.)
- Cloud notes (Google Keep, Apple Notes, Notion, etc.)

Then open the link on your mobile device.

---

## Installing as a Mobile App

After opening the PWA in your mobile browser:

### iOS (iPhone/iPad):

1. Open the site in **Safari** (must be Safari, not Chrome)
2. Tap the **Share button** (square with an upward arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired (default: "What to Watch Next")
5. Tap **"Add"** in the top right
6. The app icon appears on your home screen!

**Note**: The app will work offline after installation and receive updates automatically.

### Android:

1. Open the site in **Chrome**
2. Tap the **menu** (three dots in top right)
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **"Add"** or **"Install"** in the prompt
5. The app icon appears on your home screen!

**Alternative**: Chrome may show an install banner at the bottom of the screen - just tap "Install".

---

## Advanced: Custom Domain Setup

**⚠️ OPTIONAL - This costs money and is NOT required!**

Your free GitHub Pages URL (`https://yourusername.github.io/WatchNextPWA/`) works perfectly for everything. 

**Only do this if you want a custom domain like `watchnext.com` instead of the free GitHub URL.**

You'll need to:
- Purchase a domain name (typically $10-15/year)
- Configure DNS settings

### GitHub Pages + Custom Domain:

1. **Buy a domain** (Namecheap, GoDaddy, Google Domains, etc.) - Costs $10-15/year
2. In GitHub repository settings:
   - Go to Settings > Pages
   - Enter your domain in "Custom domain"
   - Click "Save"
3. In your domain registrar:
   - Add a CNAME record pointing to: `YOUR_USERNAME.github.io`
4. Wait for DNS propagation (can take up to 24 hours)

### Netlify Custom Domain:

**Only if you want a custom domain instead of the free Netlify URL**

1. **Buy a domain** (costs $10-15/year)
2. In Netlify:
   - Go to Site Settings > Domain Management
   - Click "Add custom domain"
   - Enter your domain
3. Follow Netlify's DNS instructions
4. SSL certificate will be automatically provisioned

### Vercel Custom Domain:

**Only if you want a custom domain instead of the free Vercel URL**

1. **Buy a domain** (costs $10-15/year)
2. In Vercel:
   - Go to Project Settings > Domains
   - Click "Add"
   - Enter your domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

---

## Testing on Local Network

Want to test on your phone before deploying? Connect to the same Wi-Fi:

1. **Find your computer's local IP**:
   ```bash
   # Mac/Linux:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows:
   ipconfig
   ```

2. **Start local server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Access from phone**:
   - Connect phone to same Wi-Fi as computer
   - Open browser and go to: `http://YOUR_IP:8000`
   - Example: `http://192.168.1.100:8000`

**Note**: Service workers won't work on local IP (need HTTPS), but you can still test the app functionality.

---

## Troubleshooting

### "Site can't be reached" on mobile
- ✅ Check the URL is typed correctly
- ✅ Verify deployment is complete (check hosting platform)
- ✅ Try accessing on a different device to rule out phone issues

### "Add to Home Screen" option not showing
- ✅ Use Safari on iOS (not Chrome)
- ✅ Use Chrome on Android (not Firefox or others)
- ✅ Make sure site is served over HTTPS
- ✅ Verify manifest.json is loading (check browser console)

### App installed but icons are missing
- ✅ Verify all icon files exist in `/icons/` folder
- ✅ Check manifest.json paths are correct
- ✅ Uninstall and reinstall the PWA
- ✅ Clear browser cache

### App not updating after making changes
- ✅ Clear browser cache
- ✅ Uninstall and reinstall the PWA
- ✅ Wait a few minutes for CDN to update
- ✅ Try accessing in incognito mode first

### Service worker errors
- ✅ Ensure HTTPS is enabled (not HTTP)
- ✅ Check browser console for specific errors
- ✅ Verify sw.js is accessible at root URL
- ✅ Check that cache names are updated if you made changes

---

## Need Help?

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify all files are present in your deployment
3. Test in an incognito/private window
4. Try a different browser

Happy watching! 🎬
