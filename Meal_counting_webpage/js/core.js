// Core Application Logic & State

// State Management
const STATE = {
    members: [], // Start empty
    entries: [],
    currentMonth: new Date(),
    settings: {
        themeMode: 'system', // system, light, dark
        textSize: 's', // xxs, xs, s, l, xl, xxl
        accentColor: '#0078D7',
        recentColors: []
    }
};

// Text Size Definitions
const TEXT_SIZES = {
    xxs: '12px',
    xs: '13px',
    s: '14px', // Default
    l: '15px',
    xl: '16px',
    xxl: '18px'
};

// Windows Standard Colors
const WINDOWS_COLORS = [
    { hex: '#FFB900', name: 'Yellow gold' }, { hex: '#FF8C00', name: 'Gold' }, { hex: '#F7630C', name: 'Orange bright' }, { hex: '#CA5010', name: 'Orange dark' }, { hex: '#DA3B01', name: 'Rust' },
    { hex: '#EF6950', name: 'Pale rust' }, { hex: '#D13438', name: 'Brick red' }, { hex: '#FF4343', name: 'Mod red' }, { hex: '#E74856', name: 'Pale red' }, { hex: '#E81123', name: 'Red' },
    { hex: '#EA005E', name: 'Rose bright' }, { hex: '#C30052', name: 'Rose' }, { hex: '#E3008C', name: 'Plum light' }, { hex: '#BF0077', name: 'Plum' }, { hex: '#C239B3', name: 'Orchid light' },
    { hex: '#9A0089', name: 'Orchid' }, { hex: '#0078D7', name: 'Default blue' }, { hex: '#0063B1', name: 'Navy blue' }, { hex: '#8E8CD8', name: 'Purple shadow' }, { hex: '#6B69D6', name: 'Purple shadow dark' },
    { hex: '#8764B8', name: 'Iris pastel' }, { hex: '#744DA9', name: 'Iris spring' }, { hex: '#B146C2', name: 'Violet red light' }, { hex: '#881798', name: 'Violet red' }, { hex: '#0099BC', name: 'Cool blue bright' },
    { hex: '#2D7D9A', name: 'Cool blue' }, { hex: '#00B7C3', name: 'Seafoam' }, { hex: '#038387', name: 'Seafoam teal' }, { hex: '#00B294', name: 'Mint light' }, { hex: '#018574', name: 'Mint dark' },
    { hex: '#00CC6A', name: 'Turf green' }, { hex: '#10893E', name: 'Sport green' }, { hex: '#7A7574', name: 'Gray' }, { hex: '#5D5A58', name: 'Gray brown' }, { hex: '#68768A', name: 'Steel blue' },
    { hex: '#515C6B', name: 'Metal blue' }, { hex: '#567C73', name: 'Pale moss' }, { hex: '#486860', name: 'Moss' }, { hex: '#498205', name: 'Meadow green' }, { hex: '#107C10', name: 'Green' },
    { hex: '#767676', name: 'Overcast' }, { hex: '#4C4A48', name: 'Storm' }, { hex: '#69797E', name: 'Blue gray' }, { hex: '#4A5459', name: 'Gray dark' }, { hex: '#647C64', name: 'Liddy green' },
    { hex: '#525E54', name: 'Sage' }, { hex: '#847545', name: 'Camouflage desert' }, { hex: '#7E735F', name: 'Camouflage' }
];

// Base Themes
const BASE_THEMES = {
    light: {
        '--background-color': '#ffffff',
        '--surface-color': '#f6f8fa',
        '--surface-border': '#25272b',
        '--text-main': '#25272b',
        '--text-muted': '#868789',
        '--avatar-text-color': '#000000'
    },
    dark: {
        '--background-color': '#000',
        '--surface-color': '#161b22',
        '--surface-border': '#25272b',
        '--text-main': '#f5f5f5',
        '--text-muted': '#c2c4c7',
        '--avatar-text-color': '#ffffff'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupNavigation();
    setupModal(); // Initialize custom modal

    // Global Enter key for Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const modal = document.querySelector('.modal-overlay.active, .cp-overlay.active');
            // If color picker is active, don't interfere
            if (modal && modal.id === 'cp-overlay') return;

            // If active modal is our custom modal
            if (modal && modal.id === 'custom-modal') {
                const confirmBtn = document.getElementById('modal-confirm-btn');
                if (confirmBtn) {
                    e.preventDefault();
                    confirmBtn.click();
                }
                return;
            }
        }
    });

    // Prevent re-rendering active page
    let currentPage = 'dashboard';

    renderPage('dashboard');
    updateTheme();
});

// Helper: Get Initials
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

// Helper: Get Avatar HTML
function getAvatar(name) {
    return `<div class="avatar">${getInitials(name)}</div>`;
}

// Helper: Render Stepper
function renderStepper(id, type, placeholder) {
    return `
        <div class="stepper-control">
            <button class="stepper-btn" onclick="updateStepper('${id}', '${type}', -1)">-</button>
            <input type="number" min="0" placeholder="${placeholder}" 
                   class="stepper-input member-${type}-input" 
                   id="${type}-${id}" data-id="${id}">
            <button class="stepper-btn" onclick="updateStepper('${id}', '${type}', 1)">+</button>
        </div>
    `;
}

// Global Stepper Update
window.updateStepper = function (id, type, delta) {
    const input = document.getElementById(`${type}-${id}`);
    if (input) {
        let val = parseInt(input.value) || 0;
        val = Math.max(0, val + delta);
        input.value = val > 0 ? val : '';
    }
};

// --- Modal System ---
let modalCallback = null;

function setupModal() {
    // Create Modal HTML Structure
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content surface-card">
            <h3 class="modal-title" id="modal-title">Title</h3>
            <p class="modal-message" id="modal-message">Message body...</p>
            <div class="modal-actions" id="modal-actions">
                <button class="btn-modal cancel" onclick="closeModal()">Cancel</button>
                <button class="btn-modal confirm" id="modal-confirm-btn">Confirm</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Event Delegation for cleanup
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        if (modalCallback) modalCallback();
        closeModal();
    });
}

function showModal({ title, message, type = 'alert', onConfirm = null, confirmText = 'Confirm', danger = false }) {
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;

    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = modal.querySelector('.cancel');

    confirmBtn.innerText = confirmText;

    // Style danger button
    if (danger) {
        confirmBtn.classList.add('danger');
        confirmBtn.classList.remove('confirm');
    } else {
        confirmBtn.classList.add('confirm');
        confirmBtn.classList.remove('danger');
    }

    if (type === 'alert') {
        cancelBtn.style.display = 'none';
        confirmBtn.innerText = 'OK';
        modalCallback = null;
    } else {
        cancelBtn.style.display = 'block';
        modalCallback = onConfirm;
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('custom-modal').classList.remove('active');
    modalCallback = null;
}

function loadState() {
    const saved = localStorage.getItem('messAppState');
    if (saved) {
        const parsed = JSON.parse(saved);
        STATE.members = parsed.members || STATE.members;
        STATE.entries = parsed.entries || STATE.entries;
        if (parsed.settings) {
            STATE.settings = { ...STATE.settings, ...parsed.settings };

            // Migration: Check for known legacy 'default' colors and update to new Default Blue #0078D7
            // This ensures users who never customized their color get the new default.
            const legacyDefaults = ['#0A84FF', '#38bdf8', '#70ffaf'];
            if (legacyDefaults.includes(STATE.settings.accentColor)) {
                STATE.settings.accentColor = '#0078D7';
            }
        }
    }
}

function saveState() {
    localStorage.setItem('messAppState', JSON.stringify(STATE));
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderPage(btn.dataset.target);
        });
    });
}

function renderPage(page) {
    // Sync navigation items active state
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.dataset.target === page) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const content = document.getElementById('main-content');
    content.innerHTML = '';
    content.style.opacity = 0;

    setTimeout(() => {
        switch (page) {
            case 'dashboard':
                if (typeof renderDashboard === 'function') renderDashboard(content);
                break;
            case 'daily':
                if (typeof renderDailyEntry === 'function') renderDailyEntry(content);
                break;
            case 'history':
                if (typeof renderHistory === 'function') renderHistory(content);
                break;
            case 'members':
                if (typeof renderMembers === 'function') renderMembers(content);
                break;
            case 'settings':
                if (typeof renderSettings === 'function') renderSettings(content);
                break;
        }
        content.style.animation = 'none';
        content.offsetHeight; /* trigger reflow */
        content.style.animation = 'fadeIn 0.9s forwards';
    }, 50);
}

// System Theme Listener
// System Theme Listener
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleThemeChange = (e) => {
    if (STATE.settings.themeMode === 'system') {
        updateTheme();
    }
};

try {
    // Modern browsers
    mediaQuery.addEventListener('change', handleThemeChange);
} catch (e1) {
    try {
        // Older Safari / IE / Edge
        mediaQuery.addListener(handleThemeChange);
    } catch (e2) {
        console.error('System theme listener not supported');
    }
}

// --- PWA Support ---
window.deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    window.deferredPrompt = e;

    // Update UI notify the user they can install the PWA
    // If the user is on the settings page, show the button
    const btn = document.getElementById('pwa-install-btn');
    if (btn) {
        btn.style.display = 'flex';
    }

    console.log('[PWA] BeforeInstallPrompt captured');
});

window.addEventListener('appinstalled', (evt) => {
    console.log('[PWA] App Installed');
    window.deferredPrompt = null;
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.style.display = 'none';
});

async function installPWA() {
    if (!window.deferredPrompt) {
        return;
    }
    // Show the install prompt
    window.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await window.deferredPrompt.userChoice;
    console.log(`[PWA] User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    window.deferredPrompt = null;

    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.style.display = 'none';
}

function updateTheme() {
    // 1. Theme Mode
    let mode = STATE.settings.themeMode;
    if (mode === 'system') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    const themeVars = BASE_THEMES[mode] || BASE_THEMES['dark']; // Fallback
    const root = document.documentElement;

    Object.keys(themeVars).forEach(key => {
        root.style.setProperty(key, themeVars[key]);
    });

    // 2. Accent Color
    // Use fallback if setting is missing (migration safety)
    const accent = STATE.settings.accentColor || '#0078D7';
    root.style.setProperty('--primary-color', accent);

    // 3. Text Size
    const sizeName = STATE.settings.textSize || 's';
    const sizeVal = TEXT_SIZES[sizeName];
    if (sizeVal) {
        document.documentElement.style.fontSize = sizeVal;
    }
}
