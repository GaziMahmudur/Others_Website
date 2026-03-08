// Core Application Logic & State

// State Management
const STATE = {
    members: [], // Start empty
    entries: [],
    currentMonth: new Date(),
    updatedAt: 0,
    settings: {
        themeMode: 'light', // system, light, dark
        textSize: 's', // xxs, xs, s, l, xl, xxl
        accentColor: '#0078D7',
        recentColors: []
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Always initialize modal system first
    setupModal();

    loadState();
    setupNavigation();
    let currentPage = 'dashboard';
    renderPage('dashboard');
    updateTheme();
    document.getElementById('app').style.display = 'block';

    // Global Enter key for Modals (keep existing)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const modal = document.querySelector('.modal-overlay.active, .cp-overlay.active');
            if (modal && modal.id === 'cp-overlay') return;
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
            <button class="stepper-btn" onclick="updateStepper('${id}', '${type}', -1)">
                <span class="material-icons-round" style="font-size:16px;">remove</span>
            </button>
            <input type="number" min="0" placeholder="${placeholder}" 
                   class="stepper-input member-${type}-input" 
                   id="${type}-${id}" data-id="${id}">
            <button class="stepper-btn" onclick="updateStepper('${id}', '${type}', 1)">
                <span class="material-icons-round" style="font-size:16px;">add</span>
            </button>
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
    try {
        const saved = localStorage.getItem('messAppState');
        if (saved) {
            const parsed = JSON.parse(saved);
            STATE.members = parsed.members || STATE.members;
            STATE.entries = parsed.entries || STATE.entries;
            STATE.updatedAt = parsed.updatedAt || 0;
            if (parsed.settings) {
                STATE.settings = { ...STATE.settings, ...parsed.settings };

                // Migration: Check for known legacy 'default' colors and update to new Default Blue #0078D7
                const legacyDefaults = ['#70ffaf'];
                if (legacyDefaults.includes(STATE.settings.accentColor)) {
                    STATE.settings.accentColor = '#0078D7';
                }
            }
            // Always reset navigation to current month on app load
            STATE.currentMonth = new Date();
        }
    } catch (e) {
        console.error("State corrupted, resetting:", e);
        localStorage.removeItem('messAppState');
        // Keep default STATE
    }
}

function saveState() {
    STATE.updatedAt = Date.now();
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

function renderPage(page, forceImmediate = false) {
    // Sync navigation items active state
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.dataset.target === page) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const content = document.getElementById('main-content');

    // If NOT immediate, fade out first
    if (!forceImmediate) {
        content.style.opacity = 0;
    }

    const renderLogic = () => {
        content.innerHTML = ''; // Clear previous content
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

        if (!forceImmediate) {
            content.style.animation = 'none';
            content.offsetHeight; /* trigger reflow */
            content.style.animation = 'fadeIn 0.9s forwards';
        } else {
            content.style.opacity = 1;
            content.style.animation = 'none';
        }
    };

    if (forceImmediate) {
        renderLogic();
    } else {
        setTimeout(renderLogic, 50);
    }
}

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

    // Resize Listener for PC/Phone theme switching
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateTheme();
        }, 100);
    });
} catch (e1) {
    try {
        // Older Safari / IE / Edge
        mediaQuery.addListener(handleThemeChange);
    } catch (e2) {
        console.error('System theme listener not supported');

    }
}

function updateTheme() {
    // 1. Determine Device Type
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const devicePrefix = isMobile ? 'phone_' : 'pc_';

    // 2. Determine Theme Mode
    let mode = STATE.settings.themeMode;
    if (mode === 'system') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // 3. Construct Theme Key & Get Variables
    const themeKey = devicePrefix + mode;
    const themeVars = BASE_THEMES[themeKey] || BASE_THEMES['pc_dark']; // Fallback

    const root = document.documentElement;

    // 4. Apply Theme Variables
    // Reset previous styles: clear hardcoded styles if any, but we are setting vars on root
    // Apply body class for specific overrides (like box-shadows)
    document.body.className = themeKey;

    Object.keys(themeVars).forEach(key => {
        root.style.setProperty(key, themeVars[key]);
    });

    // 5. Apply Accent Color (Primary)
    // Always apply the user's accent color setting (Windows Color or Custom).
    // If it's missing for some reason, fallback to Default Blue (#0078D7).
    const accent = STATE.settings.accentColor || '#0078D7';
    root.style.setProperty('--primary-color', accent);

    // 6. Text Size
    const sizeName = STATE.settings.textSize || 's';
    const sizeVal = TEXT_SIZES[sizeName];
    if (sizeVal) {
        document.documentElement.style.fontSize = sizeVal;
    }
}
