import { TRACK_DEFINITIONS, TRACK_CATEGORIES, getTrackSplineData, getTrackBestLap } from '../tracks/TrackRegistry.js';

/**
 * Generates an SVG path string for a mini 2D preview of a track from its spline data.
 */
function generateTrackSvgPath(splineData, width = 160, height = 90) {
  if (!splineData || !splineData.samples || splineData.samples.length === 0) {
    return '';
  }

  const samples = splineData.samples;
  const n = samples.length;

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < n; i += 4) {
    const pos = samples[i].position;
    if (pos[0] < minX) minX = pos[0];
    if (pos[0] > maxX) maxX = pos[0];
    if (pos[2] < minZ) minZ = pos[2];
    if (pos[2] > maxZ) maxZ = pos[2];
  }

  const spanX = Math.max(1e-4, maxX - minX);
  const spanZ = Math.max(1e-4, maxZ - minZ);
  const padding = 14;

  const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanZ);
  const offsetX = (width - spanX * scale) * 0.5 - minX * scale;
  const offsetZ = (height - spanZ * scale) * 0.5 - minZ * scale;

  let d = '';
  const step = Math.max(1, Math.floor(n / 90));
  for (let i = 0; i <= n; i += step) {
    const s = samples[i % n];
    const px = s.position[0] * scale + offsetX;
    const py = s.position[2] * scale + offsetZ;
    if (d === '') {
      d += `M ${px.toFixed(1)} ${py.toFixed(1)}`;
    } else {
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
  }
  d += ' Z';
  return d;
}

function formatLapTime(seconds) {
  if (!seconds || isNaN(seconds)) return '--:--.--';
  const totalCentis = Math.floor(seconds * 100);
  const mins = Math.floor(totalCentis / 6000);
  const secs = Math.floor((totalCentis % 6000) / 100);
  const centis = totalCentis % 100;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
}

export function createMapSelectorModal(options = {}) {
  const {
    initialTrackId = 'classic_grand_prix',
    onSelectTrack = () => {},
    originalSplineData = null,
  } = options;

  let currentTrackId = initialTrackId;
  let activeCategory = 'All';
  let searchQuery = '';
  let isOpen = false;

  // Create modal container
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'map-selector-modal';
  modalOverlay.className = 'map-modal-overlay hidden';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  modalOverlay.setAttribute('aria-labelledby', 'map-modal-title');

  modalOverlay.innerHTML = /* html */ `
    <div class="map-modal-card">
      <header class="map-modal-header">
        <div class="map-modal-title-stack">
          <div class="map-modal-eyebrow">DESK RACER · 50+ CRITICAL CIRCUITS COLLECTION</div>
          <h2 id="map-modal-title" class="map-modal-title">SELECT CIRCUIT</h2>
        </div>
        <button id="btn-close-map-modal" class="map-modal-close-btn" type="button" aria-label="Close Map Selector (Esc)" title="Close (Esc)">
          ✕
        </button>
      </header>

      <!-- Search & Category Filters -->
      <div class="map-modal-controls-bar">
        <div class="map-search-wrapper">
          <svg class="map-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            id="input-map-search"
            class="map-search-input"
            type="search"
            placeholder="Search 50+ tracks by name, monument, or style..."
            autocomplete="off"
            spellcheck="false"
          />
        </div>

        <div class="map-category-pills" id="map-category-pills">
          ${TRACK_CATEGORIES.map(
            (cat) => `
            <button
              class="map-cat-pill ${cat === 'All' ? 'active' : ''}"
              type="button"
              data-cat="${cat}"
            >${cat.toUpperCase()}</button>
          `
          ).join('')}
        </div>
      </div>

      <!-- Tracks Grid -->
      <div class="map-cards-grid-scroll">
        <div class="map-cards-grid" id="map-cards-grid">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const gridEl = modalOverlay.querySelector('#map-cards-grid');
  const searchInput = modalOverlay.querySelector('#input-map-search');
  const categoryPillsContainer = modalOverlay.querySelector('#map-category-pills');
  const btnClose = modalOverlay.querySelector('#btn-close-map-modal');

  // Pre-generate SVG previews lazily or on demand
  const svgPathCache = new Map();

  function getSvgPath(track) {
    if (svgPathCache.has(track.id)) {
      return svgPathCache.get(track.id);
    }
    const spline = getTrackSplineData(track.id, originalSplineData);
    const path = generateTrackSvgPath(spline, 180, 95);
    svgPathCache.set(track.id, path);
    return path;
  }

  function renderGrid() {
    const q = searchQuery.toLowerCase().trim();
    const filtered = TRACK_DEFINITIONS.filter((t) => {
      const matchCat =
        activeCategory === 'All' ||
        t.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        activeCategory.toLowerCase().includes(t.category.toLowerCase());
      const matchQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.landmarks && t.landmarks.some((lm) => lm.toLowerCase().includes(q))) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)));
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="map-no-results">
          <div class="map-no-results-icon">🔍</div>
          <div class="map-no-results-title">No tracks found</div>
          <div class="map-no-results-desc">Try clearing your search query or picking a different category.</div>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = filtered
      .map((t, index) => {
        const isCurrent = t.id === currentTrackId;
        const bestLap = getTrackBestLap(t.id);
        const bestLapFormatted = formatLapTime(bestLap);
        const svgPath = getSvgPath(t);

        let diffClass = 'diff-medium';
        if (t.difficulty === 'EASY') diffClass = 'diff-easy';
        else if (t.difficulty === 'HARD') diffClass = 'diff-hard';
        else if (t.difficulty === 'EXPERT') diffClass = 'diff-expert';

        return /* html */ `
          <div
            class="map-card ${isCurrent ? 'is-selected' : ''}"
            data-track-id="${t.id}"
            tabindex="0"
            role="button"
            aria-label="Select track ${t.name}"
          >
            <div class="map-card-thumb">
              <svg viewBox="0 0 180 95" class="map-svg-preview">
                <path d="${svgPath}" class="map-svg-track-glow" />
                <path d="${svgPath}" class="map-svg-track-line" />
                <circle cx="18" cy="18" r="3" class="map-svg-start-dot" />
              </svg>
              <div class="map-card-badge-row">
                <span class="map-diff-pill ${diffClass}">${t.difficulty}</span>
                <span class="map-cat-tag">${t.category}</span>
              </div>
              ${
                isCurrent
                  ? `<div class="map-active-badge">CURRENT CIRCUIT</div>`
                  : ''
              }
            </div>

            <div class="map-card-body">
              <div class="map-card-top-row">
                <div class="map-card-num">#${String(index + 1).padStart(2, '0')}</div>
                <h3 class="map-card-name">${t.name}</h3>
              </div>
              <p class="map-card-desc">${t.description}</p>

              <div class="map-card-meta-row">
                <div class="map-meta-item">
                  <span class="map-meta-label">SECTORS</span>
                  <span class="map-meta-val">${t.sectors ? t.sectors.length : 4}</span>
                </div>
                <div class="map-meta-item">
                  <span class="map-meta-label">LAPS</span>
                  <span class="map-meta-val">3</span>
                </div>
                <div class="map-meta-item">
                  <span class="map-meta-label">BEST LAP</span>
                  <span class="map-meta-val best-time">${bestLapFormatted}</span>
                </div>
              </div>

              <div class="map-card-landmarks">
                ${(t.landmarks || [])
                  .slice(0, 3)
                  .map((lm) => `<span class="map-landmark-chip">${lm}</span>`)
                  .join('')}
              </div>

              <button class="map-card-action-btn ${isCurrent ? 'active' : ''}" type="button">
                ${isCurrent ? 'CURRENTLY ACTIVE' : 'SELECT & RACE'}
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach card click handlers
    gridEl.querySelectorAll('.map-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const id = card.dataset.trackId;
        selectTrack(id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          const id = card.dataset.trackId;
          selectTrack(id);
        }
      });
    });
  }

  function selectTrack(trackId) {
    currentTrackId = trackId;
    renderGrid();
    onSelectTrack(trackId);
    close();
  }

  function open() {
    isOpen = true;
    modalOverlay.classList.remove('hidden');
    renderGrid();
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 80);
    }
  }

  function close() {
    isOpen = false;
    modalOverlay.classList.add('hidden');
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  // Event Listeners
  btnClose.addEventListener('click', close);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) close();
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });

  categoryPillsContainer.querySelectorAll('.map-cat-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryPillsContainer.querySelectorAll('.map-cat-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderGrid();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && isOpen) {
      e.preventDefault();
      close();
    }
    // Press 'M' to toggle map selector when not typing in an input
    if (
      (e.code === 'KeyM' || e.code === 'KeyT') &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      !(e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName))
    ) {
      // Don't intercept if sound mute key M was pressed while modifier or if audio handles it
      // Let's use 'KeyM' for Maps or provide designated UI buttons
    }
  });

  return {
    open,
    close,
    toggle,
    setCurrentTrackId: (id) => {
      currentTrackId = id;
      if (isOpen) renderGrid();
    },
    getCurrentTrackId: () => currentTrackId,
    isOpen: () => isOpen,
  };
}
