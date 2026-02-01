# What to Watch Next - PWA

A Progressive Web App that helps you decide what to watch next. Pick your next movie or show instantly from curated lists using the MDBList API.

## 🚀 Quick Start - Access on Mobile

**Want to use this on your phone right now?**

1. **Deploy the app** using one of these free options:
   - GitHub Pages (recommended): Enable in repository Settings > Pages
   - [Netlify](https://netlify.com): Drag & drop deployment
   - [Vercel](https://vercel.com): One-click GitHub integration

2. **Access on mobile**: Open your deployment URL in your mobile browser
   - Example: `https://yourusername.github.io/WatchNextPWA/`

3. **Install as app** (optional): Tap "Add to Home Screen" in your browser menu

📖 **Need step-by-step instructions?** See:
- [📱 MOBILE_QUICK_START.md](MOBILE_QUICK_START.md) - Simple 3-step guide
- [📋 DEPLOYMENT.md](DEPLOYMENT.md) - Comprehensive deployment guide
- [Deployment & Mobile Access](#deployment--mobile-access) section below

## Features

- 🎬 Random movie/show picker from curated lists
- 🔍 Search functionality for movies and shows
- 🎨 Dark mode UI with modern design
- 📱 PWA with offline support
- 🎯 Filter by genre, type, and minimum score
- 📊 Integrated ratings from multiple sources (IMDb, TMDb, Trakt, etc.)
- 🎮 Stremio integration for instant streaming
- 📜 Pick history tracking

## Setup

1. **Get an API Key**
   - Visit [MDBList](https://mdblist.com/) and create an account
   - Generate an API key from your account settings

2. **Configure the App**
   - Open the app in your browser
   - Click the settings icon (⚙️) in the top right
   - Enter your MDBList API key
   - Choose your default list source (Top Lists or My Lists)
   - Click Save

3. **Install as PWA** (Optional)
   - On mobile: Use "Add to Home Screen" from your browser menu
   - On desktop: Look for the install icon in the address bar

## Usage

1. **Pick Random**: Select filters and a list, then click "Pick Something for Me"
2. **Search**: Use the search button to find specific titles
3. **Open in Stremio**: Click the Stremio button to stream the selected content
4. **History**: View your recent picks in the history section

## Files Structure

```
.
├── index.html          # Main HTML file
├── app.css             # Styles
├── app.js              # Main application logic
├── sw.js               # Service worker for PWA functionality
├── manifest.json       # PWA manifest
└── icons/              # App icons for different sizes
```

## Technologies

- Vanilla JavaScript (no frameworks)
- CSS3 with custom properties
- Service Worker API for offline support
- Local Storage for data persistence
- MDBList API for movie/show data

## Browser Support

Works on all modern browsers that support:
- ES6+ JavaScript
- Service Workers
- Local Storage
- Fetch API

## Development

To run locally:

```bash
# Serve the files with any HTTP server
python3 -m http.server 8000

# Or use Node.js
npx serve
```

Then open `http://localhost:8000` in your browser.

## Deployment & Mobile Access

### Deploying the App

To access this PWA on your mobile device, you need to deploy it to a web server. Here are several free hosting options:

#### Option 1: GitHub Pages (Recommended)

1. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to "Pages" section
   - Under "Source", select your branch (e.g., `main` or `master`)
   - Select the root folder (`/`)
   - Click "Save"

2. **Access your app**:
   - Your app will be available at: `https://yourusername.github.io/WatchNextPWA/`
   - Wait 1-2 minutes for deployment to complete

#### Option 2: Netlify

1. **Deploy with Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your project folder or connect your GitHub repository
   - Netlify will automatically deploy your site

2. **Access your app**:
   - You'll get a URL like: `https://your-app-name.netlify.app`
   - Custom domains are supported

#### Option 3: Vercel

1. **Deploy with Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Click "Deploy"

2. **Access your app**:
   - You'll get a URL like: `https://your-app-name.vercel.app`

### Accessing on Mobile Device

Once deployed, follow these steps to access on your mobile:

#### Method 1: Direct URL Entry
1. Open your mobile browser (Safari on iOS, Chrome on Android)
2. Type or paste your deployment URL (e.g., `https://yourusername.github.io/WatchNextPWA/`)
3. Bookmark the page for easy access

#### Method 2: QR Code (Easiest)
1. Generate a QR code for your deployment URL:
   - Visit [qr-code-generator.com](https://www.qr-code-generator.com/)
   - Enter your app URL
   - Download the QR code
2. Scan the QR code with your mobile camera
3. Tap the notification to open the app

#### Method 3: Send Link
1. Send the deployment URL to yourself via:
   - Email
   - Messaging app (WhatsApp, Telegram, etc.)
   - Cloud notes (Google Keep, Apple Notes, etc.)
2. Open the link on your mobile device

### Installing as Mobile App

After accessing the app on your mobile:

**On iOS (Safari)**:
1. Tap the Share button (square with arrow)
2. Scroll down and tap "Add to Home Screen"
3. Name the app and tap "Add"
4. The app icon will appear on your home screen

**On Android (Chrome)**:
1. Tap the menu (three dots)
2. Tap "Add to Home Screen" or "Install App"
3. Tap "Add" or "Install"
4. The app icon will appear on your home screen

### Local Network Access (Development)

To test on mobile while developing locally:

1. **Find your computer's IP address**:
   ```bash
   # On Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows
   ipconfig
   ```

2. **Start the server** (make sure it binds to all interfaces):
   ```bash
   python3 -m http.server 8000
   ```

3. **Access from mobile**:
   - Connect your mobile to the same Wi-Fi network as your computer
   - Open browser on mobile and visit: `http://YOUR_IP_ADDRESS:8000`
   - Example: `http://192.168.1.100:8000`

### Troubleshooting Mobile Access

**App won't load on mobile:**
- Check that HTTPS is enabled (required for service workers)
- Clear browser cache and reload
- Try accessing in incognito/private mode first

**"Add to Home Screen" not showing:**
- Make sure you're using Safari on iOS or Chrome on Android
- Ensure the site is served over HTTPS
- Check that manifest.json is loading correctly

**Service worker not registering:**
- Service workers require HTTPS (except on localhost)
- Check browser console for errors
- Verify sw.js is accessible at the root URL

**Icons not showing after install:**
- Verify all icon files exist in the `/icons/` directory
- Check that manifest.json paths are correct
- Try reinstalling the PWA

## License

This project is open source and available for personal use.
