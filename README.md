# WatchNext PWA

Never struggle with what to watch again. **WatchNext** is a Progressive Web App that picks your next movie or TV show instantly using curated lists from [MDBList](https://mdblist.com/).

![WatchNext Screenshot](https://github.com/user-attachments/assets/ea34cabd-e50f-48d2-a53e-781140cc33c4)

## 🚀 Quick Start

### Option 1 — GitHub Pages (Recommended)

The app is deployed automatically via GitHub Pages. Simply visit:

**`https://<your-github-username>.github.io/WatchNextPWA/`**

> To enable GitHub Pages: go to **Settings → Pages → Source → GitHub Actions**.

### Option 2 — Run Locally

No build tools or dependencies required. Just serve the static files:

```bash
# Clone the repo
git clone https://github.com/TheAntagonist2020/WatchNextPWA.git
cd WatchNextPWA

# Serve with Python
python3 -m http.server 8080

# Or with Node.js
npx serve .
```

Then open **http://localhost:8080** in your browser.

> **Note:** A local HTTP server is required because browsers only allow Service Workers over `https://` or `localhost`. Opening `index.html` directly as a `file://` URL will not work.

### Option 3 — Install as a PWA

Once the app is open in your browser (via any method above), you can install it as a native-feeling app:

- **Chrome/Edge:** Click the install icon in the address bar, or use the browser menu → "Install app"
- **Safari (iOS):** Tap Share → "Add to Home Screen"

## ⚙️ Setup

1. Get a free API key from [mdblist.com/preferences](https://mdblist.com/preferences/)
2. Open the app and tap the **⚙ Settings** gear icon
3. Paste your API key and tap **Save**

## ✨ Features

- **Random Picker** — Get a random movie or show from curated lists
- **Filters** — Filter by genre, type (movie/TV), and minimum score
- **Search** — Search for any movie or show by title
- **Multi-Rating Display** — See scores from IMDb, TMDb, Trakt, Letterboxd, Rotten Tomatoes, and Metacritic
- **Stremio Integration** — One-tap links to watch on Stremio Web or Lite
- **Pick History** — Track your last 30 recommendations
- **Offline Support** — Core app works offline via Service Worker caching
- **Dark Theme** — Easy on the eyes

## 📁 Project Structure

```
├── index.html        # Main entry point
├── app.js            # Application logic
├── app.css           # Styles
├── sw.js             # Service Worker (offline/caching)
├── manifest.json     # PWA manifest
└── icons/            # App icons (72px–512px)
```

## 🛠 Tech Stack

- Vanilla JavaScript (ES6+)
- HTML5 / CSS3
- Progressive Web App (Service Worker + Manifest)
- [MDBList API](https://mdblist.com/)
