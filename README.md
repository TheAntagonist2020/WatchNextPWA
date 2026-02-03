# WatchNext PWA

A Progressive Web App (PWA) to help you decide what to watch next. Never struggle with decision fatigue when choosing movies or TV shows!

## Features

- 🎬 Random movie/TV show picker from curated lists
- 🔍 Search functionality for specific titles
- 📊 Multiple rating sources (MDBList, IMDb, etc.)
- 🎨 Clean, modern UI optimized for mobile
- 📱 Works offline (Progressive Web App)
- 🔐 MDBList API integration for personalized lists

## Files

- `index.html` - Main application page
- `app.js` - Application logic
- `app.css` - Styles
- `sw.js` - Service worker for offline functionality
- `manifest.json` - PWA manifest
- `icons/` - App icons in various sizes

## How to Use

1. Open `index.html` in a web browser
2. (Optional) Add your MDBList API key in Settings for personalized lists
3. Select filters (genre, type, minimum score)
4. Click "Pick Something for Me" to get a random recommendation
5. Or use the search feature to find specific titles

## Installation

This is a static PWA that can be:
- Opened directly in a browser by opening `index.html`
- Served using any static file server
- Installed as a PWA on mobile devices (Add to Home Screen)

### Local Development

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## PWA Installation

On mobile devices:
1. Open the app in a web browser
2. Look for "Add to Home Screen" option
3. The app will install and can be launched like a native app

## API

This app integrates with the [MDBList API](https://mdblist.com/api/) to fetch movie and TV show data.

## License

MIT License - Feel free to use and modify as needed.
