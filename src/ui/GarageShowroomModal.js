import * as THREE from 'three';
import {
  VEHICLE_DEFINITIONS,
  VEHICLE_CATEGORIES,
  getActiveVehicle,
  setActiveVehicle,
  getVehicleById,
} from '../vehicles/VehicleRegistry.js';
import { buildVehicleBodyMesh } from '../scene/VehicleModelBuilder.js';

/**
 * 3D Garage Showroom Modal
 * Features:
 * - Real-time 3D Studio turntable preview with mouse/touch drag controls & auto-spin
 * - Category filter tabs ('All', 'F1', 'Exotic Hypercar', 'Indian Icons', 'Muscle & JDM', 'Hot Hatch')
 * - Instant search filter across 22 vehicles
 * - Visual stat bars (Top Speed, Acceleration, Handling, Braking, Drift Grip, Weight)
 * - Drive / Equip confirmation with live game updates
 */
export function createGarageShowroomModal(options = {}) {
  const onVehicleEquipped = options.onVehicleEquipped || (() => {});

  let isOpen = false;
  let domInitialized = false;
  let activeVehicle = getActiveVehicle();
  let selectedVehicle = activeVehicle;
  let activeCategory = 'All';
  let searchQuery = '';

  // DOM Container
  let modalOverlay = document.getElementById('garage-showroom-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'garage-showroom-overlay';
    modalOverlay.className = 'garage-showroom-overlay hidden';
    document.body.appendChild(modalOverlay);
  }

  // 3D Turntable Scene State
  let renderer = null;
  let scene = null;
  let camera = null;
  let turntableGroup = null;
  let currentModelGroup = null;
  let animFrameId = null;
  let isDragging = false;
  let lastPointerX = 0;
  let turntableYaw = 0.85;
  let autoRotate = true;

  function initModalDOM() {
    modalOverlay.innerHTML = `
      <div class="garage-dialog-card" role="dialog" aria-modal="true" aria-labelledby="garage-header-title">
        <!-- Header Bar -->
        <div class="garage-header-bar">
          <div class="garage-header-left">
            <span class="garage-eyebrow">HIGH PERFORMANCE ROSTER · 22 VEHICLES</span>
            <h2 id="garage-header-title" class="garage-title">GARAGE SHOWROOM</h2>
          </div>
          <div class="garage-header-right">
            <button id="btn-close-garage" class="garage-close-btn" type="button" aria-label="Close Garage Showroom (Esc)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Main Body: Left 3D Studio Viewport + Right Vehicle Catalog & Specs -->
        <div class="garage-body-split">
          <!-- Left: 3D Turntable Studio Stage -->
          <div class="garage-stage-pane">
            <div class="garage-canvas-wrap">
              <canvas id="garage-3d-canvas" class="garage-3d-canvas"></canvas>
              <div class="garage-stage-controls-hint">DRAG TO ROTATE 360° · SCROLL OR SWIPE</div>
              <div id="garage-equipped-badge" class="garage-equipped-badge ${selectedVehicle.id === activeVehicle.id ? '' : 'hidden'}">
                CURRENTLY EQUIPPED
              </div>
            </div>

            <!-- Vehicle Quick Profile on Stage -->
            <div class="garage-vehicle-profile">
              <div class="garage-profile-main">
                <div class="garage-profile-badge-row">
                  <span id="garage-spec-brand" class="garage-badge-brand">${selectedVehicle.manufacturer}</span>
                  <span id="garage-spec-category" class="garage-badge-category">${selectedVehicle.category}</span>
                </div>
                <h3 id="garage-spec-name" class="garage-car-name">${selectedVehicle.name}</h3>
                <div id="garage-spec-engine" class="garage-car-engine">${selectedVehicle.engine}</div>
                <p id="garage-spec-desc" class="garage-car-desc">${selectedVehicle.description}</p>
              </div>

              <!-- Primary Action: Equip Vehicle -->
              <div class="garage-actions-row">
                <button id="btn-equip-vehicle" class="garage-equip-btn" type="button">
                  <span id="garage-equip-btn-label">DRIVE THIS CAR</span>
                  <kbd class="garage-kbd">ENTER ↵</kbd>
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Vehicle Selector & Live Stat Bars -->
          <div class="garage-catalog-pane">
            <!-- Search & Filters -->
            <div class="garage-filter-bar">
              <div class="garage-search-box">
                <svg class="garage-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input id="garage-search-input" class="garage-search-input" type="text" placeholder="Search 22 vehicles by name, brand, engine..." />
              </div>

              <div class="garage-category-tabs" id="garage-category-tabs">
                ${VEHICLE_CATEGORIES.map(
                  (cat) => `
                  <button class="garage-cat-tab ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
                    ${cat}
                  </button>
                `
                ).join('')}
              </div>
            </div>

            <!-- Performance Stat Bars -->
            <div class="garage-stat-card">
              <div class="garage-stat-header">
                <span>PERFORMANCE RATINGS</span>
                <span id="garage-stat-overall" class="garage-stat-overall">RATING: 9.6</span>
              </div>
              <div class="garage-stat-grid" id="garage-stat-grid">
                <!-- Dynamically rendered stat bars -->
              </div>
            </div>

            <!-- Vehicle Cards List -->
            <div class="garage-car-list" id="garage-car-list">
              <!-- Dynamically populated vehicle items -->
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
    init3DStudio();
  }

  function bindEvents() {
    // Close button & overlay click
    modalOverlay.querySelector('#btn-close-garage').addEventListener('click', close);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) close();
    });

    // Equip button
    modalOverlay.querySelector('#btn-equip-vehicle').addEventListener('click', equipCurrentVehicle);

    // Search Input
    const searchInput = modalOverlay.querySelector('#garage-search-input');
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderVehicleList();
    });

    // Category Tabs
    const tabsContainer = modalOverlay.querySelector('#garage-category-tabs');
    tabsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.garage-cat-tab');
      if (!btn) return;
      tabsContainer.querySelectorAll('.garage-cat-tab').forEach((t) => t.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      renderVehicleList();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      equipCurrentVehicle();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      navigateVehicle(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      navigateVehicle(-1);
    }
  }

  function navigateVehicle(delta) {
    const visibleVehicles = getFilteredVehicles();
    if (visibleVehicles.length === 0) return;
    const currentIndex = visibleVehicles.findIndex((v) => v.id === selectedVehicle.id);
    let nextIndex = (currentIndex + delta + visibleVehicles.length) % visibleVehicles.length;
    selectVehicle(visibleVehicles[nextIndex]);
  }

  function getFilteredVehicles() {
    return VEHICLE_DEFINITIONS.filter((v) => {
      const matchCat = activeCategory === 'All' || v.category === activeCategory;
      const matchQuery =
        !searchQuery ||
        v.name.toLowerCase().includes(searchQuery) ||
        v.manufacturer.toLowerCase().includes(searchQuery) ||
        v.engine.toLowerCase().includes(searchQuery) ||
        v.category.toLowerCase().includes(searchQuery);
      return matchCat && matchQuery;
    });
  }

  function renderVehicleList() {
    const listEl = modalOverlay.querySelector('#garage-car-list');
    if (!listEl) return;

    const filtered = getFilteredVehicles();
    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="garage-empty-state">
          No vehicles matched "${searchQuery}". Try selecting 'All' or a different category.
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered
      .map((car) => {
        const isSelected = car.id === selectedVehicle.id;
        const isEquipped = car.id === activeVehicle.id;
        const colorHex = '#' + (car.primaryColor || 0xff2b1e).toString(16).padStart(6, '0');

        return `
          <div class="garage-car-item ${isSelected ? 'selected' : ''}" data-id="${car.id}">
            <div class="garage-item-swatch" style="background-color: ${colorHex}"></div>
            <div class="garage-item-info">
              <div class="garage-item-top">
                <span class="garage-item-name">${car.name}</span>
                ${isEquipped ? '<span class="garage-item-equipped-tag">EQUIPPED</span>' : ''}
              </div>
              <div class="garage-item-sub">
                <span>${car.manufacturer}</span>
                <span class="garage-sep">·</span>
                <span>${car.category}</span>
              </div>
            </div>
            <div class="garage-item-rating">
              <span class="rating-val">${car.stats.topSpeed.toFixed(1)}</span>
              <span class="rating-label">SPD</span>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach click listeners to cards
    listEl.querySelectorAll('.garage-car-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const car = getVehicleById(id);
        if (car) selectVehicle(car);
      });
    });
  }

  function selectVehicle(car) {
    selectedVehicle = car;
    updateStageUI();
    renderStatBars();
    renderVehicleList();
    update3DModel(car);
  }

  function updateStageUI() {
    const brandEl = modalOverlay.querySelector('#garage-spec-brand');
    const catEl = modalOverlay.querySelector('#garage-spec-category');
    const nameEl = modalOverlay.querySelector('#garage-spec-name');
    const engineEl = modalOverlay.querySelector('#garage-spec-engine');
    const descEl = modalOverlay.querySelector('#garage-spec-desc');
    const badgeEl = modalOverlay.querySelector('#garage-equipped-badge');
    const btnLabel = modalOverlay.querySelector('#garage-equip-btn-label');
    const equipBtn = modalOverlay.querySelector('#btn-equip-vehicle');

    if (brandEl) brandEl.textContent = selectedVehicle.manufacturer;
    if (catEl) catEl.textContent = selectedVehicle.category;
    if (nameEl) nameEl.textContent = selectedVehicle.name;
    if (engineEl) engineEl.textContent = selectedVehicle.engine;
    if (descEl) descEl.textContent = selectedVehicle.description;

    const isEquipped = selectedVehicle.id === activeVehicle.id;
    if (badgeEl) {
      if (isEquipped) badgeEl.classList.remove('hidden');
      else badgeEl.classList.add('hidden');
    }

    if (btnLabel && equipBtn) {
      if (isEquipped) {
        btnLabel.textContent = 'CAR READY ON TRACK';
        equipBtn.classList.add('is-active');
      } else {
        btnLabel.textContent = 'DRIVE THIS CAR';
        equipBtn.classList.remove('is-active');
      }
    }
  }

  function renderStatBars() {
    const gridEl = modalOverlay.querySelector('#garage-stat-grid');
    const overallEl = modalOverlay.querySelector('#garage-stat-overall');
    if (!gridEl) return;

    const s = selectedVehicle.stats;
    const overall = (
      (s.topSpeed * 1.2 + s.acceleration * 1.1 + s.handling * 1.1 + s.braking + s.driftGrip) /
      5.4
    ).toFixed(1);
    if (overallEl) overallEl.textContent = `PERFORMANCE INDEX: ${overall} / 10`;

    const statRows = [
      { label: 'TOP SPEED', value: s.topSpeed, max: 10, unit: 'km/h rating', color: '#00e5ff' },
      { label: 'ACCELERATION', value: s.acceleration, max: 10, unit: '0-100 sprint', color: '#ff2a44' },
      { label: 'HANDLING & APEX', value: s.handling, max: 10, unit: 'cornering bite', color: '#00ff88' },
      { label: 'BRAKING POWER', value: s.braking, max: 10, unit: 'stoppers', color: '#ffaa00' },
      { label: 'DRIFT & TIRE GRIP', value: s.driftGrip, max: 10, unit: 'lateral slip', color: '#b55fe6' },
      { label: 'CURB WEIGHT', value: s.weight, max: 10, unit: 'lightweight index', color: '#8899aa' },
    ];

    gridEl.innerHTML = statRows
      .map((row) => {
        const pct = Math.min(100, (row.value / row.max) * 100);
        return `
          <div class="garage-stat-row">
            <div class="stat-labels">
              <span class="stat-name">${row.label}</span>
              <span class="stat-val" style="color: ${row.color}">${row.value.toFixed(1)} <span class="stat-unit">/ 10</span></span>
            </div>
            <div class="stat-track">
              <div class="stat-fill" style="width: ${pct}%; background-color: ${row.color}"></div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  function equipCurrentVehicle() {
    activeVehicle = setActiveVehicle(selectedVehicle.id);
    updateStageUI();
    renderVehicleList();
    onVehicleEquipped(activeVehicle);

    // Provide visual feedback and close garage so player returns to circuit
    const equipBtn = modalOverlay.querySelector('#btn-equip-vehicle');
    const labelEl = modalOverlay.querySelector('#garage-equip-btn-label');
    if (equipBtn) {
      equipBtn.classList.add('equip-pulse');
      if (labelEl) labelEl.textContent = 'CAR READY ON TRACK!';
      setTimeout(() => {
        equipBtn.classList.remove('equip-pulse');
        close();
      }, 300);
    } else {
      close();
    }
  }

  // -------------------------------------------------------------------------
  // 3D TURNTABLE STUDIO
  // -------------------------------------------------------------------------
  function init3DStudio() {
    const canvas = modalOverlay.querySelector('#garage-3d-canvas');
    if (!canvas) return;

    const width = canvas.clientWidth || 540;
    const height = canvas.clientHeight || 380;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0f15);

    camera = new THREE.PerspectiveCamera(36, width / height, 0.05, 10.0);
    camera.position.set(0.0, 0.22, 0.52);
    camera.lookAt(0, 0.02, 0);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Turntable Group (rotates horizontally)
    turntableGroup = new THREE.Group();
    scene.add(turntableGroup);

    // Cylindrical Brushed Metallic Platform
    const platformGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.015, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e27,
      roughness: 0.35,
      metalness: 0.85,
    });
    const platformMesh = new THREE.Mesh(platformGeo, platformMat);
    platformMesh.position.y = -0.0075;
    turntableGroup.add(platformMesh);

    // Glowing Neon Ring on Turntable Outer Rim
    const ringGeo = new THREE.TorusGeometry(0.182, 0.0016, 12, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
    });
    const rimRing = new THREE.Mesh(ringGeo, ringMat);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = 0.0002;
    turntableGroup.add(rimRing);

    // Soft Studio Ground Mirror Disc
    const mirrorGeo = new THREE.CircleGeometry(0.165, 36);
    const mirrorMat = new THREE.MeshBasicMaterial({
      color: 0x05070a,
      transparent: true,
      opacity: 0.82,
    });
    const mirrorMesh = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirrorMesh.rotation.x = -Math.PI / 2;
    mirrorMesh.position.y = 0.0004;
    turntableGroup.add(mirrorMesh);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keySpot = new THREE.SpotLight(0xfff5ea, 3.2, 3.0, Math.PI / 4, 0.35);
    keySpot.position.set(0.25, 0.65, 0.45);
    keySpot.lookAt(0, 0, 0);
    scene.add(keySpot);

    const coolRimLight = new THREE.DirectionalLight(0x00bfff, 1.8);
    coolRimLight.position.set(-0.35, 0.40, -0.40);
    scene.add(coolRimLight);

    const warmFillLight = new THREE.DirectionalLight(0xff9944, 1.2);
    warmFillLight.position.set(0.35, 0.25, -0.35);
    scene.add(warmFillLight);

    // Interactive Drag Controls
    canvas.addEventListener('pointerdown', (e) => {
      isDragging = true;
      autoRotate = false;
      lastPointerX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      turntableYaw += dx * 0.012;
      turntableGroup.rotation.y = turntableYaw;
    });

    const stopDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (_e) {}
        // Resume slow auto-rotate after 2.5s idle
        setTimeout(() => {
          if (!isDragging) autoRotate = true;
        }, 2500);
      }
    };

    canvas.addEventListener('pointerup', stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);

    // Initial 3D Model
    update3DModel(selectedVehicle);
  }

  function update3DModel(vehicle) {
    if (!turntableGroup) return;

    if (currentModelGroup) {
      turntableGroup.remove(currentModelGroup);
      currentModelGroup = null;
    }

    // Build showroom vehicle at 7.5x scale so it fills the studio turntable nicely
    currentModelGroup = buildVehicleBodyMesh(vehicle, {
      showroom: true,
      scale: 7.5,
    });
    currentModelGroup.position.set(0, 0.001, 0);
    turntableGroup.add(currentModelGroup);
  }

  function startAnimationLoop() {
    let lastTime = performance.now();

    function renderLoop(time) {
      if (!isOpen) return;
      animFrameId = requestAnimationFrame(renderLoop);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (autoRotate && turntableGroup) {
        turntableYaw += dt * 0.42;
        turntableGroup.rotation.y = turntableYaw;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }

    animFrameId = requestAnimationFrame(renderLoop);
  }

  function stopAnimationLoop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function handleResize() {
    if (!renderer || !camera || !modalOverlay) return;
    const canvas = modalOverlay.querySelector('#garage-3d-canvas');
    if (!canvas) return;
    const width = canvas.clientWidth || 540;
    const height = canvas.clientHeight || 380;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function open() {
    isOpen = true;
    activeVehicle = getActiveVehicle();
    selectedVehicle = activeVehicle;
    if (!domInitialized) {
      initModalDOM();
      domInitialized = true;
    }
    modalOverlay.classList.remove('hidden');
    document.body.classList.add('garage-open');

    updateStageUI();
    renderStatBars();
    renderVehicleList();
    update3DModel(selectedVehicle);

    setTimeout(() => {
      handleResize();
      startAnimationLoop();
    }, 50);

    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
  }

  function close() {
    isOpen = false;
    stopAnimationLoop();
    modalOverlay.classList.add('hidden');
    document.body.classList.remove('garage-open');
    window.removeEventListener('resize', handleResize);
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  return {
    open,
    close,
    toggle,
    isOpen: () => isOpen,
    getSelectedVehicle: () => selectedVehicle,
    getActiveVehicle: () => activeVehicle,
  };
}
