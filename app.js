// ══════════════════════════════════════════════════
//  What to Watch Next — PWA
// ══════════════════════════════════════════════════

// ── State ──
const API_BASE = 'https://api.mdblist.com';
let apiKey = '';
let cachedLists = [];
let cachedListItems = {};
let pickHistory = [];
let letterboxdWatched = [];
let hideWatched = true;
let watchedIndex = {
  imdb: new Set(),
  title: new Set(),
};

// ── DOM ──
const $ = (id) => document.getElementById(id);
let els = {};

// ── Storage (localStorage for PWA) ──
const storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(`wn_${key}`);
      return val !== null ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`wn_${key}`, JSON.stringify(value));
    } catch {
      // storage full — ignore
    }
  },
};

// ── Utilities ──
function showLoading(msg = 'Finding something great...') {
  els.loadingText.textContent = msg;
  els.loading.classList.remove('hidden');
}

function hideLoading() {
  els.loading.classList.add('hidden');
}

function setStatus(text) {
  els.statusText.textContent = text;
}

function showToast(message, type = 'error') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

async function api(path, options = {}) {
  const sep = path.includes('?') ? '&' : '?';
  const url = `${API_BASE}${path}${sep}apikey=${apiKey}`;
  const res = await fetch(url, options);
  if (res.status === 429) throw new Error('Rate limit hit. Try again later.');
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const remaining = res.headers.get('X-RateLimit-Remaining');
  if (remaining !== null) {
    els.apiCalls.textContent = `${remaining} left`;
  }
  return res.json();
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function scoreClass(score) {
  if (score >= 70) return 'high';
  if (score >= 50) return 'mid';
  return 'low';
}

function formatRuntime(mins) {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function normalizeTitle(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function makeTitleKey(title, year) {
  return `${normalizeTitle(title)}|${year || ''}`;
}

function parseCsv(text) {
  const rows = [];
  let current = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(current);
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      current = '';
      continue;
    }
    if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  row.push(current);
  if (row.some((cell) => cell !== '')) rows.push(row);
  return rows;
}

function findHeaderIndex(headers, keys) {
  const normalized = headers.map((header) =>
    String(header || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  );
  for (const key of keys) {
    const idx = normalized.indexOf(key);
    if (idx !== -1) return idx;
  }
  return -1;
}

function rebuildWatchedIndex(entries) {
  watchedIndex = {
    imdb: new Set(),
    title: new Set(),
  };
  entries.forEach((entry) => {
    if (entry.imdbId) watchedIndex.imdb.add(entry.imdbId);
    if (entry.title) watchedIndex.title.add(makeTitleKey(entry.title, entry.year));
  });
}

function updateLetterboxdStatus() {
  const count = letterboxdWatched.length;
  els.letterboxdStatus.textContent = count
    ? `Imported ${count.toLocaleString()} watched titles`
    : 'No data imported';
  els.clearLetterboxd.disabled = count === 0;
}

function isWatched(item) {
  if (!hideWatched || letterboxdWatched.length === 0) return false;
  const imdbId = item.imdb_id || item.imdbid || '';
  if (imdbId && watchedIndex.imdb.has(imdbId)) return true;
  const title = item.title || item.name || '';
  const year = item.year || '';
  if (!title) return false;
  return watchedIndex.title.has(makeTitleKey(title, year));
}

// ── Settings ──
function openSettings() {
  els.settingsPanel.classList.remove('hidden');
  els.apiKeyInput.value = apiKey;
}

function closeSettings() {
  els.settingsPanel.classList.add('hidden');
}

// ── Genres ──
async function loadGenres() {
  try {
    const genres = await api('/genres');
    els.genreFilter.innerHTML = '<option value="">Any Genre</option>';
    if (Array.isArray(genres)) {
      genres.forEach((g) => {
        const opt = document.createElement('option');
        opt.value = g.id || g.name;
        opt.textContent = g.name;
        els.genreFilter.appendChild(opt);
      });
    }
  } catch {
    const fallback = [
      'Action','Adventure','Animation','Comedy','Crime','Documentary',
      'Drama','Family','Fantasy','History','Horror','Music','Mystery',
      'Romance','Science Fiction','Thriller','War','Western'
    ];
    els.genreFilter.innerHTML = '<option value="">Any Genre</option>';
    fallback.forEach((g) => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      els.genreFilter.appendChild(opt);
    });
  }
}

function importLetterboxdCsv(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return { entries: [], hasHeader: false };
  }

  const headers = rows[0];
  const titleIndex = findHeaderIndex(headers, ['title', 'name', 'filmname']);
  const yearIndex = findHeaderIndex(headers, ['year', 'filmyear']);
  const imdbIndex = findHeaderIndex(headers, ['imdbid', 'imdb']);

  if (titleIndex === -1 && imdbIndex === -1) {
    return { entries: [], hasHeader: false };
  }

  const entries = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const title = row[titleIndex] ? String(row[titleIndex]).trim() : '';
    const yearVal = row[yearIndex] ? String(row[yearIndex]).trim() : '';
    const imdbId = row[imdbIndex] ? String(row[imdbIndex]).trim() : '';
    if (!title && !imdbId) continue;
    entries.push({
      title,
      year: yearVal,
      imdbId,
    });
  }
  return { entries, hasHeader: true };
}

function mergeWatchedEntries(entries) {
  const byKey = new Map();
  entries.forEach((entry) => {
    const imdbKey = entry.imdbId ? `imdb:${entry.imdbId}` : '';
    const titleKey = entry.title ? `title:${makeTitleKey(entry.title, entry.year)}` : '';
    const key = imdbKey || titleKey;
    if (!key) return;
    if (!byKey.has(key)) {
      byKey.set(key, entry);
    }
  });
  return Array.from(byKey.values());
}

// ── Lists ──
async function loadLists() {
  try {
    const source = els.defaultList.value;
    let lists = [];

    if (source === 'my') {
      lists = await api('/lists/user');
    } else {
      lists = await api('/lists/top');
    }

    cachedLists = Array.isArray(lists) ? lists : [];
    els.listSelect.innerHTML = '';

    if (cachedLists.length === 0) {
      els.listSelect.innerHTML = '<option value="">No lists found</option>';
      return;
    }

    cachedLists.forEach((list) => {
      const opt = document.createElement('option');
      opt.value = list.id;
      opt.textContent = `${list.name} (${list.items || '?'} items)`;
      els.listSelect.appendChild(opt);
    });

    setStatus(`${cachedLists.length} lists loaded`);
  } catch (err) {
    showToast(err.message);
    els.listSelect.innerHTML = '<option value="">Error loading lists</option>';
  }
}

// ── Get List Items ──
async function getListItems(listId) {
  if (cachedListItems[listId]) return cachedListItems[listId];

  const genre = els.genreFilter.value;
  const type = els.typeFilter.value;
  const minScore = parseInt(els.scoreFilter.value) || 0;

  let path = `/lists/${listId}/items?limit=100&append_to_response=genre`;
  if (genre) path += `&filter_genre=${encodeURIComponent(genre)}`;

  const data = await api(path);
  let items = Array.isArray(data) ? data : (data.movies || data.shows || data.items || []);

  // Filter by type
  if (type) {
    items = items.filter((item) => {
      const itemType = (item.mediatype || item.type || '').toLowerCase();
      if (type === 'movie') return itemType === 'movie';
      if (type === 'show') return itemType === 'show' || itemType === 'series' || itemType === 'tv';
      return true;
    });
  }

  // Filter by score
  if (minScore > 0) {
    items = items.filter((item) => (item.score || 0) >= minScore);
  }

  // Filter by Letterboxd watched list
  if (hideWatched && letterboxdWatched.length > 0) {
    items = items.filter((item) => !isWatched(item));
  }

  cachedListItems[listId] = items;
  return items;
}

// ── Pick Random ──
async function pickRandom() {
  const listId = els.listSelect.value;
  if (!listId) {
    showToast('No list selected');
    return;
  }

  showLoading();
  try {
    const items = await getListItems(listId);
    if (items.length === 0) {
      hideLoading();
      showToast('No items match your filters. Try adjusting them.');
      return;
    }

    const pick = randomFrom(items);
    await showResult(pick);
  } catch (err) {
    hideLoading();
    showToast(err.message);
  }
}

// ── Show Result ──
async function showResult(item) {
  showLoading('Loading details...');
  try {
    let detail = item;
    const imdbId = item.imdb_id || item.imdbid;
    const tmdbId = item.tmdb_id || item.tmdbid;

    const rawType = (item.mediatype || item.type || 'movie').toLowerCase();
    const apiType = (rawType === 'show' || rawType === 'series' || rawType === 'tv') ? 'show' : 'movie';

    if (imdbId) {
      try {
        detail = await api(`/imdb/${apiType}/${imdbId}?append_to_response=genre`);
        if (!detail.mediatype && !detail.type) detail.mediatype = apiType;
      } catch { /* use fallback */ }
    } else if (tmdbId) {
      try {
        detail = await api(`/tmdb/${apiType}/${tmdbId}?append_to_response=genre`);
        if (!detail.mediatype && !detail.type) detail.mediatype = apiType;
      } catch { /* use fallback */ }
    }

    renderCard(detail, item);
    addToHistory(detail, item);
    hideLoading();
  } catch (err) {
    hideLoading();
    showToast(err.message);
  }
}

function renderCard(detail, fallback) {
  const title = detail.title || fallback.title || 'Unknown';
  const year = detail.year || fallback.year || '';
  const type = detail.mediatype || detail.type || fallback.mediatype || fallback.type || '';
  const runtime = detail.runtime || fallback.runtime || 0;
  const score = detail.score ?? fallback.score ?? 0;
  const description = detail.description || detail.overview || fallback.description || '';
  const genres = detail.genre || detail.genres || [];
  const poster = detail.poster || fallback.poster || '';
  const imdbId = detail.imdb_id || detail.imdbid || fallback.imdb_id || fallback.imdbid || '';

  els.resultTitle.textContent = title;
  els.resultYear.textContent = year;
  els.resultType.textContent = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  els.resultRuntime.textContent = formatRuntime(runtime);

  els.resultScore.textContent = score;
  els.resultScore.className = `score-badge ${scoreClass(score)}`;

  if (poster) {
    els.resultPoster.innerHTML = `<img src="${poster}" alt="${title}" loading="lazy">`;
  } else {
    els.resultPoster.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M10 9l5 3-5 3V9z"/>
      </svg>`;
  }

  els.resultDescription.textContent = description || 'No description available.';

  els.resultGenres.innerHTML = '';
  const genreList = Array.isArray(genres) ? genres : (typeof genres === 'string' ? genres.split(',') : []);
  genreList.forEach((g) => {
    if (!g) return;
    const span = document.createElement('span');
    span.className = 'tag';
    const label = typeof g === 'object' ? (g.name || '') : String(g);
    span.textContent = label.trim();
    els.resultGenres.appendChild(span);
  });

  els.resultRatings.innerHTML = '';
  const ratingMap = [
    { key: 'imdbrating', label: 'IMDb' },
    { key: 'tmdbrating', label: 'TMDb' },
    { key: 'traktrating', label: 'Trakt' },
    { key: 'letterboxdrating', label: 'Letterboxd' },
    { key: 'rottenrating', label: 'RT' },
    { key: 'metacriticrating', label: 'Metacritic' },
  ];
  ratingMap.forEach(({ key, label }) => {
    const val = detail[key];
    if (val !== undefined && val !== null && val !== 0) {
      const div = document.createElement('div');
      div.className = 'rating-item';
      div.innerHTML = `<span class="ri-source">${label}</span><span class="ri-value">${val}</span>`;
      els.resultRatings.appendChild(div);
    }
  });

  // Stremio buttons
  const typeLower = (type || '').toLowerCase();
  const mediaType = (typeLower === 'show' || typeLower === 'series' || typeLower === 'tv')
    ? 'series' : 'movie';
  els.watchOnStremioWeb.dataset.imdbId = imdbId;
  els.watchOnStremioWeb.dataset.type = mediaType;
  els.watchOnStremioWeb.disabled = !imdbId;
  els.watchOnStremioApp.disabled = !imdbId;

  els.resultCard.classList.remove('hidden');

  // Scroll the card into view
  setTimeout(() => {
    els.resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  setStatus(`Showing: ${title}`);
}

// ── Stremio ──
function getStremioData() {
  const imdbId = els.watchOnStremioWeb.dataset.imdbId;
  const type = els.watchOnStremioWeb.dataset.type;
  return { imdbId, type };
}

function openStremioWeb() {
  const { imdbId, type } = getStremioData();
  if (!imdbId) { showToast('No IMDB ID available'); return; }

  // Stremio Web — works on every device, no app needed
  const webUrl = `https://web.stremio.com/#/detail/${type}/${imdbId}`;
  window.open(webUrl, '_blank');
  setStatus('Opening Stremio Web...');
}

function openStremioApp() {
  const { imdbId, type } = getStremioData();
  if (!imdbId) { showToast('No IMDB ID available'); return; }

  // Try native stremio:// deep link (Stremio Lite on iOS, Stremio on Android/desktop)
  const stremioUrl = `stremio:///detail/${type}/${imdbId}/${type === 'movie' ? imdbId : ''}`;
  const webUrl = `https://web.stremio.com/#/detail/${type}/${imdbId}`;

  window.location.href = stremioUrl;

  // If the app doesn't open within 2s, fall back to Stremio Web
  const fallbackTimer = setTimeout(() => {
    window.open(webUrl, '_blank');
  }, 2000);

  // If app opened (page goes hidden), cancel fallback
  const handleVisibility = () => {
    if (document.hidden) {
      clearTimeout(fallbackTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
    }
  };
  document.addEventListener('visibilitychange', handleVisibility);

  setStatus('Opening Stremio Lite...');
}

// ── Search ──
async function searchMedia() {
  const query = (els.searchInput.value || '').trim();
  if (!query) return;

  const type = els.typeFilter.value || 'any';
  showLoading('Searching...');

  try {
    const results = await api(`/search/${type}?query=${encodeURIComponent(query)}&limit=10`);
    const items = Array.isArray(results) ? results : (results.search || []);

    els.searchResults.innerHTML = '';

    if (items.length === 0) {
      els.searchResults.innerHTML = '<div style="padding:16px;color:var(--text-muted);text-align:center">No results found</div>';
      hideLoading();
      return;
    }

    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'result-item';
      const posterHtml = item.poster
        ? `<img class="ri-poster" src="${item.poster}" alt="">`
        : `<div class="ri-poster"></div>`;
      const scoreHtml = item.score ? `<span class="ri-score">${item.score}</span>` : '';
      div.innerHTML = `
        ${posterHtml}
        <div class="ri-info">
          <div class="ri-title">${item.title || 'Unknown'}</div>
          <div class="ri-meta">${item.year || ''} &middot; ${item.mediatype || item.type || ''}</div>
        </div>
        ${scoreHtml}
      `;
      div.addEventListener('click', () => showResult(item));
      els.searchResults.appendChild(div);
    });

    hideLoading();
    setStatus(`${items.length} results`);
  } catch (err) {
    hideLoading();
    showToast(err.message);
  }
}

// ── History ──
function addToHistory(detail, fallback) {
  const entry = {
    title: detail.title || fallback.title || 'Unknown',
    year: detail.year || fallback.year || '',
    imdb_id: detail.imdb_id || detail.imdbid || fallback.imdb_id || fallback.imdbid || '',
    mediatype: detail.mediatype || detail.type || fallback.mediatype || fallback.type || 'movie',
    poster: detail.poster || fallback.poster || '',
    timestamp: Date.now(),
  };

  pickHistory = pickHistory.filter((h) => h.imdb_id !== entry.imdb_id);
  pickHistory.unshift(entry);
  pickHistory = pickHistory.slice(0, 30);

  storage.set('history', pickHistory);
  renderHistory();
}

function renderHistory() {
  if (pickHistory.length === 0) {
    els.historySection.classList.add('hidden');
    return;
  }

  els.historySection.classList.remove('hidden');
  els.historyList.innerHTML = '';

  pickHistory.slice(0, 10).forEach((entry) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <span class="hi-title">${entry.title}</span>
      <span class="hi-year">${entry.year || ''}</span>
      <span class="hi-action">Open</span>
    `;
    div.addEventListener('click', () => {
      if (entry.imdb_id) {
        const type = (entry.mediatype === 'show' || entry.mediatype === 'series') ? 'series' : 'movie';
        window.open(`https://web.stremio.com/#/detail/${type}/${entry.imdb_id}`, '_blank');
      }
    });
    els.historyList.appendChild(div);
  });
}

// ── Events ──
function bindEvents() {
  // Settings
  els.settingsBtn.addEventListener('click', openSettings);
  els.cancelSettings.addEventListener('click', closeSettings);
  els.saveSettings.addEventListener('click', async () => {
    apiKey = (els.apiKeyInput.value || '').trim();
    storage.set('apiKey', apiKey);
    storage.set('defaultList', els.defaultList.value);
    closeSettings();
    showToast('Settings saved!', 'success');
    if (apiKey) {
      cachedListItems = {};
      await init();
    }
  });

  els.toggleKey.addEventListener('click', () => {
    els.apiKeyInput.type = els.apiKeyInput.type === 'password' ? 'text' : 'password';
  });

  // Pick
  els.pickBtn.addEventListener('click', () => {
    cachedListItems = {};
    pickRandom();
  });
  els.pickAnother.addEventListener('click', () => {
    cachedListItems = {};
    pickRandom();
  });

  // Dismiss card
  els.dismissCard.addEventListener('click', () => {
    els.resultCard.classList.add('hidden');
  });

  // Search toggle
  els.searchBtn.addEventListener('click', () => {
    els.searchPanel.classList.toggle('hidden');
    if (!els.searchPanel.classList.contains('hidden')) {
      els.searchInput.focus();
    }
  });
  els.searchGoBtn.addEventListener('click', searchMedia);
  els.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchMedia();
  });

  // Stremio
  els.watchOnStremioWeb.addEventListener('click', openStremioWeb);
  els.watchOnStremioApp.addEventListener('click', openStremioApp);

  // History
  els.clearHistory.addEventListener('click', () => {
    pickHistory = [];
    storage.set('history', []);
    renderHistory();
    showToast('History cleared', 'success');
  });

  // Letterboxd import
  els.letterboxdFile.addEventListener('change', async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    showLoading('Importing Letterboxd data...');
    try {
      const allEntries = [];
      let hasValidHeader = false;
      for (const file of files) {
        const text = await file.text();
        const { entries, hasHeader } = importLetterboxdCsv(text);
        allEntries.push(...entries);
        if (hasHeader) hasValidHeader = true;
      }
      const entries = mergeWatchedEntries(allEntries);
      if (!hasValidHeader) {
        showToast('CSV header not recognized. Expected Name/Title + Year or IMDb ID.');
      } else if (entries.length === 0) {
        showToast('No Letterboxd titles found in that CSV.');
      } else {
        letterboxdWatched = entries;
        storage.set('letterboxdWatched', letterboxdWatched);
        rebuildWatchedIndex(letterboxdWatched);
        updateLetterboxdStatus();
        cachedListItems = {};
        showToast(`Imported ${entries.length.toLocaleString()} watched titles.`, 'success');
      }
    } catch (err) {
      showToast('Could not read that CSV file.');
    } finally {
      hideLoading();
      event.target.value = '';
    }
  });

  els.clearLetterboxd.addEventListener('click', () => {
    letterboxdWatched = [];
    storage.set('letterboxdWatched', []);
    rebuildWatchedIndex(letterboxdWatched);
    updateLetterboxdStatus();
    cachedListItems = {};
    showToast('Letterboxd data cleared.', 'success');
  });

  els.hideWatchedToggle.addEventListener('change', () => {
    hideWatched = els.hideWatchedToggle.checked;
    storage.set('hideWatched', hideWatched);
    cachedListItems = {};
  });

  // List source change
  els.defaultList.addEventListener('change', () => {
    storage.set('defaultList', els.defaultList.value);
  });

  els.listSelect.addEventListener('change', () => {
    cachedListItems = {};
  });
}

// ── Init ──
async function init() {
  if (!apiKey) {
    setStatus('Set your API key in Settings');
    els.listSelect.innerHTML = '<option value="">Set API key first</option>';
    els.pickBtn.disabled = true;
    els.searchBtn.disabled = true;
    openSettings();
    return;
  }

  els.pickBtn.disabled = false;
  els.searchBtn.disabled = false;

  try {
    setStatus('Loading...');
    await Promise.all([loadGenres(), loadLists()]);
    renderHistory();

    try {
      const user = await api('/user');
      if (user && user.requests_remaining !== undefined) {
        els.apiCalls.textContent = `${user.requests_remaining} left`;
      }
    } catch { /* non-critical */ }
  } catch (err) {
    showToast(err.message);
    setStatus('Error loading');
  }
}

// ── Boot ──
document.addEventListener('DOMContentLoaded', async () => {
  // Populate DOM refs
  els = {
    settingsBtn: $('settingsBtn'),
    settingsPanel: $('settingsPanel'),
    apiKeyInput: $('apiKeyInput'),
    toggleKey: $('toggleKey'),
    defaultList: $('defaultList'),
    saveSettings: $('saveSettings'),
    cancelSettings: $('cancelSettings'),
    mainView: $('mainView'),
    genreFilter: $('genreFilter'),
    typeFilter: $('typeFilter'),
    scoreFilter: $('scoreFilter'),
    listSelect: $('listSelect'),
    pickBtn: $('pickBtn'),
    searchBtn: $('searchBtn'),
    searchPanel: $('searchPanel'),
    searchInput: $('searchInput'),
    searchGoBtn: $('searchGoBtn'),
    searchResults: $('searchResults'),
    resultCard: $('resultCard'),
    dismissCard: $('dismissCard'),
    resultPoster: $('resultPoster'),
    resultTitle: $('resultTitle'),
    resultYear: $('resultYear'),
    resultType: $('resultType'),
    resultRuntime: $('resultRuntime'),
    resultScore: $('resultScore'),
    resultDescription: $('resultDescription'),
    resultGenres: $('resultGenres'),
    resultRatings: $('resultRatings'),
    watchOnStremioWeb: $('watchOnStremioWeb'),
    watchOnStremioApp: $('watchOnStremioApp'),
    pickAnother: $('pickAnother'),
    historySection: $('historySection'),
    historyList: $('historyList'),
    clearHistory: $('clearHistory'),
    letterboxdFile: $('letterboxdFile'),
    clearLetterboxd: $('clearLetterboxd'),
    letterboxdStatus: $('letterboxdStatus'),
    hideWatchedToggle: $('hideWatchedToggle'),
    loading: $('loading'),
    loadingText: $('loadingText'),
    statusText: $('statusText'),
    apiCalls: $('apiCalls'),
  };

  // Load saved data
  apiKey = storage.get('apiKey', '');
  pickHistory = storage.get('history', []);
  letterboxdWatched = storage.get('letterboxdWatched', []);
  hideWatched = storage.get('hideWatched', true);
  rebuildWatchedIndex(letterboxdWatched);
  const savedList = storage.get('defaultList', 'top');
  if (savedList) els.defaultList.value = savedList;
  els.hideWatchedToggle.checked = hideWatched;
  updateLetterboxdStatus();

  bindEvents();
  await init();

  // Register service worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (err) {
      console.log('SW registration failed:', err);
    }
  }
});
