# What to Watch Next - PWA

A Progressive Web App that helps you decide what to watch next. Pick your next movie or show instantly from curated lists using the MDBList API.

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

## License

This project is open source and available for personal use.
