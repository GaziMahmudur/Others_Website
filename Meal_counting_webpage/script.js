// State Management
const STATE = {
    members: [], // Start empty
    entries: [],
    currentMonth: new Date(),
    theme: 'default'
};

// Theme Presets
const THEMES = {
    default: { // Black (Midnight Professional)
        '--bg-gradient-start': '#000000',
        '--bg-gradient-end': '#000000',
        '--primary-color': '#0866ff',
        '--text-main': '#FFFFFF',
        '--text-muted': '#C5C6C7',
        '--surface-color': 'rgba(26, 26, 29, 0.4)',  /* #1A1A1D converted to RGBA for glass */
        '--surface-border': '#0866ff'
    },
    light: {
        '--bg-gradient-start': '#D9D9D9',
        '--bg-gradient-end': '#D9D9D9',
        '--primary-color': '#0866ff',
        '--text-main': '#1E1E1E',
        '--text-muted': '#656565',
        '--surface-color': 'rgba(255, 255, 255, 0.6)',
        '--surface-border': '#DEE2E6'
    },
    red: {
        '--bg-gradient-start': '#2B0B0B',
        '--bg-gradient-end': '#4A0E0E',
        '--primary-color': '#FF4D4D',
        '--text-main': '#FFF5F5',
        '--text-muted': '#A08181',
        '--surface-color': 'rgba(61, 20, 20, 0.4)',
        '--surface-border': '#8B0000'
    },
    green: {
        '--bg-gradient-start': '#051612',
        '--bg-gradient-end': '#0A2E26',
        '--primary-color': '#1DB954',
        '--text-main': '#F0FFF4',
        '--text-muted': '#8E9A96',
        '--surface-color': 'rgba(18, 60, 51, 0.4)',
        '--surface-border': '#2D5A50'
    },
    blue: {
        '--bg-gradient-start': '#020C1B',
        '--bg-gradient-end': '#0A192F',
        '--primary-color': '#64FFDA',
        '--text-main': '#CCD6F6',
        '--text-muted': '#8892B0',
        '--surface-color': 'rgba(17, 34, 64, 0.4)',
        '--surface-border': '#233554'
    },
    lavender: {
        '--bg-gradient-start': '#1A1B2E',
        '--bg-gradient-end': '#2D2B52',
        '--primary-color': '#BD93F9',
        '--text-main': '#F8F8F2',
        '--text-muted': '#9499C3',
        '--surface-color': 'rgba(52, 53, 94, 0.4)',
        '--surface-border': '#6272A4'
    },
    orange: {
        '--bg-gradient-start': '#121212',
        '--bg-gradient-end': '#1E1E1E',
        '--primary-color': '#FF9F1C',
        '--text-main': '#FFFFFF',
        '--text-muted': '#B3B3B3',
        '--surface-color': 'rgba(37, 37, 37, 0.4)',
        '--surface-border': '#FF9F1C'
    },
    earth: {
        '--bg-gradient-start': '#FDFCF0',
        '--bg-gradient-end': '#F2EFE9',
        '--primary-color': '#7D4E3A',
        '--text-main': '#2C2C2C',
        '--text-muted': '#8C8C8C',
        '--surface-color': 'rgba(250, 249, 246, 0.6)',
        '--surface-border': '#D9D4CC'
    },
    aurora: {
        '--bg-gradient-start': '#050B16',
        '--bg-gradient-end': '#0B1E2D',
        '--primary-color': '#00F5D4',
        '--text-main': '#E0FBFC',
        '--text-muted': '#93B1C1',
        '--surface-color': 'rgba(19, 38, 57, 0.4)',
        '--surface-border': '#1D4D4F'
    },
    rosewood: {
        '--bg-gradient-start': '#1A0F0F',
        '--bg-gradient-end': '#2D1B1B',
        '--primary-color': '#D4AF37',
        '--text-main': '#FFF1F1',
        '--text-muted': '#A68B8B',
        '--surface-color': 'rgba(54, 34, 34, 0.4)',
        '--surface-border': '#5E3D3D'
    },
    nordic: {
        '--bg-gradient-start': '#F0F4F8',
        '--bg-gradient-end': '#D9E2EC',
        '--primary-color': '#1273EB',
        '--text-main': '#102A43',
        '--text-muted': '#486581',
        '--surface-color': 'rgba(255, 255, 255, 0.6)',
        '--surface-border': '#BCCCDC'
    },
    dusk: {
        '--bg-gradient-start': '#10002B',
        '--bg-gradient-end': '#240046',
        '--primary-color': '#FF006E',
        '--text-main': '#FFFFFF',
        '--text-muted': '#9D4EDD',
        '--surface-color': 'rgba(60, 9, 108, 0.4)',
        '--surface-border': '#5A189A'
    },
    sandstone: {
        '--bg-gradient-start': '#F5F2ED',
        '--bg-gradient-end': '#E8E3D9',
        '--primary-color': '#4A5568',
        '--text-main': '#1A202C',
        '--text-muted': '#718096',
        '--surface-color': 'rgba(255, 255, 255, 0.6)',
        '--surface-border': '#CBD5E0'
    },
    solar: {
        '--bg-gradient-start': '#0F0F0F',
        '--bg-gradient-end': '#1A1612',
        '--primary-color': '#FB8500',
        '--text-main': '#FFB703',
        '--text-muted': '#8E8E8E',
        '--surface-color': 'rgba(36, 33, 29, 0.4)',
        '--surface-border': '#3D3830'
    },
    forest: {
        '--bg-gradient-start': '#0B130E',
        '--bg-gradient-end': '#16221B',
        '--primary-color': '#A7C957',
        '--text-main': '#F2E8CF',
        '--text-muted': '#6A994E',
        '--surface-color': 'rgba(31, 47, 37, 0.4)',
        '--surface-border': '#386641'
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupNavigation();
    setupModal(); // Initialize custom modal
    
    // Global Enter key for Modals
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('custom-modal');
        if (e.key === 'Enter' && modal.classList.contains('active')) {
            e.preventDefault();
            const confirmBtn = document.getElementById('modal-confirm-btn');
            if (confirmBtn) confirmBtn.click();
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
window.updateStepper = function(id, type, delta) {
    const input = document.getElementById(`${type}-${id}`);
    if(input) {
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
        <div class="modal-content glass">
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
    if(danger) {
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
        STATE.theme = parsed.theme || STATE.theme;
        STATE.customTheme = parsed.customTheme;
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

    // Don't re-render if already on page (optional optimization)
    // if (currentPage === page && document.getElementById('main-content').innerHTML !== '') return;
    // currentPage = page;

    const content = document.getElementById('main-content');
    content.innerHTML = '';
    content.style.opacity = 0;
    
    setTimeout(() => {
        switch(page) {
            case 'dashboard': renderDashboard(content); break;
            case 'daily': renderDailyEntry(content); break;
            case 'history': renderHistory(content); break;
            case 'members': renderMembers(content); break;
            case 'settings': renderSettings(content); break;
        }
        content.style.animation = 'none';
        content.offsetHeight; /* trigger reflow */
        content.style.animation = 'fadeIn 0.9s forwards';
    }, 50);
}

// --- Member Management ---
function addMember() {
    const nameInput = document.getElementById('new-member-name');
    const name = nameInput.value.trim();
    if (!name) return;
    
    const newId = STATE.members.length > 0 ? Math.max(...STATE.members.map(m => m.id)) + 1 : 1;
    STATE.members.push({ id: newId, name: name, deposit: 0 });
    saveState();
    nameInput.value = '';
    renderMembers(document.getElementById('main-content'));
}

function deleteMember(id) {
    showModal({
        title: 'Delete Member?',
        message: 'This will remove the member. Are you sure?',
        type: 'confirm',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
             STATE.members = STATE.members.filter(m => m.id !== id);
             saveState();
             renderMembers(document.getElementById('main-content'));
        }
    });
}

function renderMembers(container) {
    container.innerHTML = `
        <h2 class="section-title">Manage Members</h2>
        
        <div class="glass glass-card input-group" style="display:flex; gap:10px;">
            <input type="text" id="new-member-name" class="input-field" placeholder="Enter Member Name">
            <button class="btn" onclick="addMember()">Add</button>
        </div>

        <div id="members-list">
            ${STATE.members.length === 0 ? `
                <div style="text-align:center; opacity:0.6; padding:40px;">
                    <span class="material-icons-round" style="font-size:48px; margin-bottom:10px;">group_add</span>
                    <p>No members yet.<br>Add your first member above!</p>
                </div>
            ` : ''}
            ${STATE.members.map(m => `
                <div class="glass glass-card row-pop" style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        ${getAvatar(m.name)}
                        <div style="font-weight:600;">${m.name}</div>
                    </div>
                    <button class="btn-icon-only" style="background: rgba(248,113,113,0.15); color: #f87171;" onclick="deleteMember(${m.id})">
                        <span class="material-icons-round">delete</span>
                    </button>
                </div>
            `).join('')}
        </div>
    `;

    // Add Enter key listener for new member input to trigger the button click
    const input = container.querySelector('#new-member-name');
    const button = container.querySelector('.btn');
    if (input && button) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                button.click();
            }
        });
    }
}

// --- Dashboard Component ---
function showBalanceInfo() {
    showModal({
        title: 'How is Balance Calculated?',
        message: 'Balance = Paid - Cost.\n\nCost = (Your Meals × Meal Rate).\n\nMeal Rate = Total Shopping Cost / Total Meals.',
        type: 'alert'
    });
}

function renderDashboard(container) {
    const stats = calculateStats();
    
    // Header
    const month = STATE.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const html = `
        <div class="month-selector glassglass">
            <button class="btn btn-icon-only glass" onclick="changeMonth(-1)"><span class="material-icons-round">chevron_left</span></button>
            <span class="month-label">${month}</span>
            <button class="btn btn-icon-only glass" onclick="changeMonth(1)"><span class="material-icons-round">chevron_right</span></button>
        </div>

        <div class="summary-grid">
            <div class="glass glass-card summary-card fadeInUp-stagger">
                <h3>Total Meals</h3>
                <div class="value">${stats.totalMeals}</div>
            </div>
             <div class="glass glass-card summary-card fadeInUp-stagger">
                <h3>Total Bazar</h3>
                <div class="value">${stats.totalCost}</div>
            </div>
            <div class="glass glass-card summary-card fadeInUp-stagger highlight">
                <h3>Meal Rate</h3>
                <div class="value">${stats.mealRate.toFixed(2)}</div>
            </div>
        </div>

        <!-- Charts Section -->
        ${stats.totalCost > 0 ? `
            <div class="glass glass-card fadeInUp-stagger">
                <div class="section-title">Expense Breakdown</div>
                <div class="chart-container">
                    <canvas id="costChart"></canvas>
                </div>
            </div>
        ` : ''}

        <div class="glass glass-card">
            <div class="section-title">
                <span>Balance Overview</span>
                <span class="material-icons-round" style="font-size: 16px; cursor: pointer;" onclick="showBalanceInfo()">info</span>
            </div>
            <div class="table-container">
                <table class="balance-table">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Meals</th>
                            <th>Paid</th>
                            <th>Cost</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${STATE.members.map(m => {
                            const mStats = stats.memberStats[m.id];
                            const balance = mStats.deposit - mStats.cost;
                            return `
                                <tr class="row-pop">
                                    <td>${m.name}</td>
                                    <td>${mStats.meals}</td>
                                    <td>${mStats.deposit}</td>
                                    <td>${mStats.cost.toFixed(0)}</td>
                                    <td class="${balance >= 0 ? 'text-green' : 'text-red'}">
                                        ${balance >= 0 ? '+' : ''}${balance.toFixed(0)}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <button class="btn" style="width: 100%; margin-top: 20px;" onclick="exportDashboard()">
            <span class="material-icons-round">download</span> Download Monthly Report
        </button>
    `;
    
    container.innerHTML = html;

    // Draw Chart if data exists
    if(stats.totalCost > 0) {
        setTimeout(() => drawCostChart(stats), 100);
    }
}

function drawCostChart(stats) {
    const ctx = document.getElementById('costChart');
    if(!ctx) return;

    // Prepare Data
    const labels = [];
    const data = [];
    const colors = [
        '#38bdf8', '#4ade80', '#f87171', '#f472b6', '#a78bfa', '#fbbf24'
    ]; // Just some nice colors

    Object.keys(stats.memberStats).forEach((id, index) => {
        const m = STATE.members.find(mem => mem.id == id);
        if(m) {
            labels.push(m.name);
            data.push(stats.memberStats[id].cost);
        }
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#94a3b8', font: { family: 'Outfit', size: 10 } }
                }
            },
            layout: { padding: 10 }
        }
    });
}

function calculateStats() {
    let totalMeals = 0;
    let totalCost = 0;
    const memberStats = {};
    
    STATE.members.forEach(m => {
        memberStats[m.id] = { meals: 0, cost: 0, deposit: m.deposit };
    });
    
    const currentYear = STATE.currentMonth.getFullYear();
    const currentMonth = STATE.currentMonth.getMonth();

    STATE.entries.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonth) {
            Object.entries(entry.meals).forEach(([id, count]) => {
                if(memberStats[id]) {
                    memberStats[id].meals += count;
                    totalMeals += count;
                }
            });
            
            Object.entries(entry.bazar || {}).forEach(([id, amount]) => {
                 totalCost += amount;
                 if(memberStats[id]) {
                    memberStats[id].deposit += amount; 
                 }
            });
        }
    });
    
    const mealRate = totalMeals > 0 ? totalCost / totalMeals : 0;
    
    Object.keys(memberStats).forEach(id => {
        memberStats[id].cost = memberStats[id].meals * mealRate;
    });
    
    return { totalMeals, totalCost, mealRate, memberStats };
}

function changeMonth(delta) {
    STATE.currentMonth.setMonth(STATE.currentMonth.getMonth() + delta);
    renderDashboard(document.getElementById('main-content'));
}

// --- Daily Entry Component ---
function renderDailyEntry(container) {
    // Default to the currently selected month in STATE
    const year = STATE.currentMonth.getFullYear();
    const month = String(STATE.currentMonth.getMonth() + 1).padStart(2, '0');
    const currentMonthStr = `${year}-${month}`;
    
    const html = `
        <h2 class="section-title">Monthly Entry</h2>
        <div class="glass glass-card input-group">
             <label>Select Month</label>
             <div class="input-with-icon" onclick="openMonthPicker()">
                 <!-- Display Input (Read Only) -->
                 <input type="text" value="${STATE.currentMonth.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}" 
                        class="input-field with-icon-right" id="entryDateDisplay" readonly style="cursor: pointer;">
                 <span class="material-icons-round input-icon right">expand_more</span>
                 
                 <!-- Hidden Actual Value Input for Save Logic -->
                 <input type="hidden" value="${currentMonthStr}" id="entryDate">
             </div>
        </div>
        
        <div id="members-entry-list">
            ${STATE.members.map((m, index) => `
                <div class="glass glass-card entry-card row-pop" style="animation-delay: ${index * 0.05}s">
                    <div style="font-weight: 600; font-size: 0.9rem; display:flex; align-items:center; gap:8px;">
                        ${getAvatar(m.name)} 
                        ${m.name}
                    </div>
                    <div>
                        <label>Meals</label>
                        ${renderStepper(m.id, 'meal', '0')}
                    </div>
                    <div>
                        <label>Bazar</label>
                        <!-- Keep simple input for Bazar as it handles larger numbers better, or use stepper? Let's use simple input for money -->
                        <div class="input-with-icon">
                            <input type="number" min="0" placeholder="0" class="input-field member-bazar-input" data-id="${m.id}" style="padding-left:10px;">
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="display: flow-root;">
            <button class="btn btn-inline-save" onclick="saveEntry()">
                <span class="material-icons-round">save</span> Save Entry
            </button>
        </div>
    `;
    container.innerHTML = html;

    // Advanced Enter Key Navigation for Entry Form
    const inputs = Array.from(container.querySelectorAll('input[type="number"]'));
    inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                } else {
                    // Trigger visual click on save button
                    const saveBtn = container.querySelector('.btn-inline-save');
                    if(saveBtn) {
                        saveBtn.focus(); // Move focus to button
                        saveBtn.click(); // Trigger click
                    } else {
                        saveEntry();
                    }
                }
            }
        });
        
        // Auto-scroll to center on focus
        input.addEventListener('focus', (e) => {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300); // Slight delay to allow keyboard to pop up on mobile
        });
    });
}

// --- Custom Date Picker Logic ---
let pickerYear = new Date().getFullYear();

function openMonthPicker() {
    // Check if picker already exists
    if (document.getElementById('custom-month-picker')) return;

    // Get current value
    const currentVal = document.getElementById('entryDate').value; // YYYY-MM
    if(currentVal) {
        pickerYear = parseInt(currentVal.split('-')[0]);
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'custom-month-picker';
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if(e.target === modal) closeMonthPicker();
    });

    document.body.appendChild(modal);
    renderCustomMonthPicker();
}

function renderCustomMonthPicker() {
    const modal = document.getElementById('custom-month-picker');
    if(!modal) return;
    
    // Determine currently selected month to highlight
    const currentVal = document.getElementById('entryDate') ? document.getElementById('entryDate').value : '';
    const selectedMonth = (currentVal && parseInt(currentVal.split('-')[0]) === pickerYear) 
                          ? parseInt(currentVal.split('-')[1]) - 1 
                          : -1;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    modal.innerHTML = `
        <div class="month-picker-content">
            <div class="year-selector">
                <button class="btn-icon-only" onclick="changePickerYear(-1)">
                    <span class="material-icons-round">chevron_left</span>
                </button>
                <span>${pickerYear}</span>
                <button class="btn-icon-only" onclick="changePickerYear(1)">
                    <span class="material-icons-round">chevron_right</span>
                </button>
            </div>
            <div class="month-grid">
                ${months.map((m, index) => `
                    <button class="month-btn ${index === selectedMonth ? 'active' : ''}" 
                            onclick="selectPickerMonth(${index})">
                        ${m}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function changePickerYear(delta) {
    pickerYear += delta;
    renderCustomMonthPicker();
}

function selectPickerMonth(monthIndex) {
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const fullStr = `${pickerYear}-${monthStr}`;
    
    // Update Hidden Input (Logic)
    const entryDateInput = document.getElementById('entryDate');
    if(entryDateInput) entryDateInput.value = fullStr;

    // Update Display Input (Visual)
    const displayInput = document.getElementById('entryDateDisplay');
    if(displayInput) {
        const date = new Date(pickerYear, monthIndex);
        displayInput.value = date.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
    }

    closeMonthPicker();
}

function closeMonthPicker() {
    const modal = document.getElementById('custom-month-picker');
    if(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function saveEntry() {
    let date = document.getElementById('entryDate').value; // YYYY-MM
    const meals = {};
    const bazar = {};
    
    document.querySelectorAll('.member-meal-input').forEach(input => {
        const val = parseInt(input.value);
        if (val > 0) meals[input.dataset.id] = val;
    });
    
    document.querySelectorAll('.member-bazar-input').forEach(input => {
        const val = parseInt(input.value);
        if (val > 0) bazar[input.dataset.id] = val;
    });
    
    if (Object.keys(meals).length === 0 && Object.keys(bazar).length === 0) {
        showModal({
            title: 'Wait!',
            message: 'Please enter at least some data before saving.',
            type: 'alert'
        });
        return;
    }
    
    // Append a day to ensure stats calculation works reliably (middle of month avoids potential timezone edge cases)
    if(date.length === 7) { 
        date += '-15'; 
    }

    STATE.entries.push({ date, meals, bazar });
    saveState();
    showModal({
        title: 'Success',
        message: 'Entry Saved Successfully!',
        type: 'alert' // acts as success
    });
    renderPage('dashboard');
}

// --- History Component ---
function renderHistory(container) {
    const sorted = [...STATE.entries].sort((a,b) => new Date(b.date) - new Date(a.date));
    
    if (sorted.length === 0) {
        container.innerHTML = `
            <h2 class="section-title">History</h2>
            <div class="glass glass-card" style="text-align:center; padding:40px; color:var(--text-muted);">
                No history entries yet.
            </div>
        `;
        return;
    }

    const html = `
        <h2 class="section-title">History</h2>
        <div class="history-list">
            ${sorted.map((entry) => {
                const totalM = Object.values(entry.meals).reduce((a,b)=>a+b, 0);
                const totalB = Object.values(entry.bazar || {}).reduce((a,b)=>a+b, 0);
                
                const originalIndex = STATE.entries.indexOf(entry);

                const entryMealRate = totalM > 0 ? totalB / totalM : 0;

                const details = `
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; color: var(--text-muted);">
                            <thead>
                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left;">
                                    <th style="padding: 4px;">Name</th>
                                    <th style="padding: 4px; text-align: center;">M</th>
                                    <th style="padding: 4px; text-align: center;">B</th>
                                    <th style="padding: 4px; text-align: right;">Bal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${STATE.members.map(m => {
                                    const mMeals = entry.meals[m.id] || 0;
                                    const mBazar = (entry.bazar && entry.bazar[m.id]) || 0;
                                    const mCost = mMeals * entryMealRate;
                                    const mBalance = mBazar - mCost;
                                    
                                    if(mMeals === 0 && mBazar === 0) return '';
                                    
                                    return `
                                        <tr>
                                            <td style="padding: 4px; color: var(--text-main); font-weight: 500;">${m.name}</td>
                                            <td style="padding: 4px; text-align: center;">${mMeals}</td>
                                            <td style="padding: 4px; text-align: center;">${mBazar}</td>
                                            <td style="padding: 4px; text-align: right; color: ${mBalance >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}; font-weight: 600;">
                                                ${mBalance >= 0 ? '+' : ''}${Math.round(mBalance)}
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                        <div style="margin-top: 8px; font-size: 0.7rem; opacity: 0.6; text-align: right;">
                            Meal Rate: ${entryMealRate.toFixed(2)}
                        </div>
                    </div>
                `;

                return `
                <div class="glass glass-card history-item" onclick="toggleHistory(this)" style="position: relative;">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-right: 30px;">
                        <div class="history-date">
                            <span>${new Date(entry.date).toLocaleDateString('en-US', {day:'numeric', month:'short'})}</span>
                            <span>${new Date(entry.date).getFullYear()}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold;">${totalM} Meals</div>
                            <div style="font-size: 0.8rem; color: var(--success-color);">+ ${totalB} Bazar</div>
                        </div>
                    </div>
                    
                    <button class="btn-icon-only" 
                            style="position: absolute; top: 15px; right: 10px; background: rgba(248,113,113,0.1); color: #f87171; width: 30px; height: 30px; padding: 5px;"
                            onclick="event.stopPropagation(); deleteEntry(${originalIndex})">
                        <span class="material-icons-round" style="font-size: 16px;">delete</span>
                    </button>

                    <div class="history-details" style="display:none; margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05);">
                        ${details || 'No component data'}
                    </div>
                </div>
                `;
            }).join('')}
        </div>
    `;
    container.innerHTML = html;
}

function deleteEntry(index) {
    showModal({
        title: 'Delete Entry?',
        message: 'This will permanently remove this history record.',
        type: 'confirm',
        confirmText: 'Delete',
        danger: true,
        onConfirm: () => {
            STATE.entries.splice(index, 1);
            saveState();
            renderHistory(document.getElementById('main-content'));
        }
    });
}

window.toggleHistory = function(element) {
    const details = element.querySelector('.history-details');
    if (details.style.display === 'none') {
        details.style.display = 'block';
        element.style.background = 'rgba(255, 255, 255, 0.08)'; 
    } else {
        details.style.display = 'none';
        element.style.background = '';
    }
}

// --- Settings Component ---
function renderSettings(container) {
    container.innerHTML = `
        <h2 class="section-title">Appearance</h2>
        <div class="glass glass-card">
            <label style="margin-bottom:12px;">Theme Preset</label>
            <div class="theme-grid" style="grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));">
                <div class="theme-preset row-pop ${STATE.theme === 'default' ? 'active' : ''}" 
                     title="Midnight Black"
                     style="background: linear-gradient(135deg, #0B0C10, #1F2833); border: 2px solid #45A29E; animation-delay: 0.05s;"
                     onclick="setTheme('default')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'light' ? 'active' : ''}" 
                     title="Clean Minimalist"
                     style="background: linear-gradient(135deg, #F8F9FA, #E9ECEF); border: 2px solid #DEE2E6; animation-delay: 0.1s;"
                     onclick="setTheme('light')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'red' ? 'active' : ''}" 
                     title="Luxury Crimson"
                     style="background: linear-gradient(135deg, #2B0B0B, #4A0E0E); border: 2px solid #8B0000; animation-delay: 0.15s;"
                     onclick="setTheme('red')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'green' ? 'active' : ''}" 
                     title="Forest Organic"
                     style="background: linear-gradient(135deg, #051612, #0A2E26); border: 2px solid #2D5A50; animation-delay: 0.2s;"
                     onclick="setTheme('green')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'blue' ? 'active' : ''}" 
                     title="Deep Ocean"
                     style="background: linear-gradient(135deg, #020C1B, #0A192F); border: 2px solid #233554; animation-delay: 0.25s;"
                     onclick="setTheme('blue')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'lavender' ? 'active' : ''}" 
                     title="Creative Lavender"
                     style="background: linear-gradient(135deg, #1A1B2E, #2D2B52); border: 2px solid #6272A4; animation-delay: 0.3s;"
                     onclick="setTheme('lavender')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'orange' ? 'active' : ''}" 
                     title="Cyber Orange"
                     style="background: linear-gradient(135deg, #121212, #1E1E1E); border: 2px solid #FF9F1C; animation-delay: 0.35s;"
                     onclick="setTheme('orange')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'earth' ? 'active' : ''}" 
                     title="Earth & Clay"
                     style="background: linear-gradient(135deg, #FDFCF0, #F2EFE9); border: 2px solid #D9D4CC; animation-delay: 0.4s;"
                     onclick="setTheme('earth')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'aurora' ? 'active' : ''}" 
                     title="Aurora Night"
                     style="background: linear-gradient(135deg, #050B16, #0B1E2D); border: 2px solid #1D4D4F; animation-delay: 0.45s;"
                     onclick="setTheme('aurora')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'rosewood' ? 'active' : ''}" 
                     title="Rosewood & Gold"
                     style="background: linear-gradient(135deg, #1A0F0F, #2D1B1B); border: 2px solid #5E3D3D; animation-delay: 0.5s;"
                     onclick="setTheme('rosewood')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'nordic' ? 'active' : ''}" 
                     title="Nordic Frost"
                     style="background: linear-gradient(135deg, #F0F4F8, #D9E2EC); border: 2px solid #BCCCDC; animation-delay: 0.55s;"
                     onclick="setTheme('nordic')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'dusk' ? 'active' : ''}" 
                     title="Cyberpunk Dusk"
                     style="background: linear-gradient(135deg, #10002B, #240046); border: 2px solid #5A189A; animation-delay: 0.6s;"
                     onclick="setTheme('dusk')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'sandstone' ? 'active' : ''}" 
                     title="Sandstone & Slate"
                     style="background: linear-gradient(135deg, #F5F2ED, #E8E3D9); border: 2px solid #CBD5E0; animation-delay: 0.65s;"
                     onclick="setTheme('sandstone')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'solar' ? 'active' : ''}" 
                     title="Solar Flare"
                     style="background: linear-gradient(135deg, #0F0F0F, #1A1612); border: 2px solid #3D3830; animation-delay: 0.7s;"
                     onclick="setTheme('solar')"></div>
                <div class="theme-preset row-pop ${STATE.theme === 'forest' ? 'active' : ''}" 
                     title="Deep Forest"
                     style="background: linear-gradient(135deg, #0B130E, #16221B); border: 2px solid #386641; animation-delay: 0.75s;"
                     onclick="setTheme('forest')"></div>
            </div>
            
            <div class="row-pop" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 10px; animation-delay: 0.8s;">
                <h3 style="font-size:1rem; margin:0;">Custom Theme Creator</h3>
                <button class="btn-icon-only" onclick="toggleCustomTheme()" style="width: 30px; height: 30px; background: rgba(255,255,255,0.05);">
                    <span class="material-icons-round" id="theme-toggle-icon">expand_more</span>
                </button>
            </div>
            
            <div id="custom-theme-wrapper" style="display: none; transition: all 0.3s ease;">
                <div class="input-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label>Primary (Neon)</label>
                        <input type="color" id="custom-primary" class="input-field" style="height: 50px; padding: 5px;" 
                               value="${(STATE.theme === 'custom' ? STATE.customTheme['--primary-color'] : THEMES[STATE.theme]['--primary-color']) || '#38bdf8'}" 
                               oninput="previewCustomTheme()">
                    </div>
                    <div>
                        <label>Background Start</label>
                        <input type="color" id="custom-bg-start" class="input-field" style="height: 50px; padding: 5px;" 
                               value="${(STATE.theme === 'custom' ? STATE.customTheme['--bg-gradient-start'] : THEMES[STATE.theme]['--bg-gradient-start']) || '#0f172a'}" 
                               oninput="previewCustomTheme()">
                    </div>
                    <div>
                        <label>Background End</label>
                        <input type="color" id="custom-bg-end" class="input-field" style="height: 50px; padding: 5px;" 
                               value="${(STATE.theme === 'custom' ? STATE.customTheme['--bg-gradient-end'] : THEMES[STATE.theme]['--bg-gradient-end']) || '#020617'}" 
                               oninput="previewCustomTheme()">
                    </div>
                    <div>
                        <label>Text Color</label>
                        <input type="color" id="custom-text" class="input-field" style="height: 50px; padding: 5px;" 
                               value="${(STATE.theme === 'custom' ? STATE.customTheme['--text-main'] : THEMES[STATE.theme]['--text-main']) || '#f1f5f9'}" 
                               oninput="previewCustomTheme()">
                    </div>
                </div>
                <button class="btn" style="width:100%;" onclick="saveCustomTheme()">
                    Apply Custom Theme (Save as New)
                </button>
            </div>
        </div>
        
        <button class="btn" style="width:100%; background: var(--danger-color); margin-top: 20px;" onclick="resetData()">
            Reset All Data
        </button>
    `;
}

function previewCustomTheme() {
    const primary = document.getElementById('custom-primary').value;
    const bgStart = document.getElementById('custom-bg-start').value;
    const bgEnd = document.getElementById('custom-bg-end').value;
    const text = document.getElementById('custom-text').value;
    
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--primary-glow', primary + '4d');
    document.documentElement.style.setProperty('--bg-gradient-start', bgStart);
    document.documentElement.style.setProperty('--bg-gradient-end', bgEnd);
    document.documentElement.style.setProperty('--text-main', text);
}

function saveCustomTheme() {
    const primary = document.getElementById('custom-primary').value;
    const bgStart = document.getElementById('custom-bg-start').value;
    const bgEnd = document.getElementById('custom-bg-end').value;
    const text = document.getElementById('custom-text').value;
    
    STATE.theme = 'custom';
    STATE.customTheme = {
        '--primary-color': primary,
        '--primary-glow': primary + '4d',
        '--bg-gradient-start': bgStart,
        '--bg-gradient-end': bgEnd,
        '--text-main': text
    };
    saveState();
    showModal({
        title: 'Theme Saved',
        message: 'Your custom theme has been applied successfully!',
        type: 'alert'
    });
    renderSettings(document.getElementById('main-content'));
}


function setTheme(themeName) {
    // Capture state before re-render
    const wrapper = document.getElementById('custom-theme-wrapper');
    const wasOpen = wrapper && wrapper.style.display !== 'none';

    STATE.theme = themeName;
    saveState();
    updateTheme();
    renderSettings(document.getElementById('main-content'));

    // Restore state
    if (wasOpen) {
        const newWrapper = document.getElementById('custom-theme-wrapper');
        const newIcon = document.getElementById('theme-toggle-icon');
        if (newWrapper) {
            newWrapper.style.display = 'block';
            newWrapper.style.opacity = '1';
        }
        if (newIcon) {
            newIcon.innerText = 'expand_less';
        }
    }
    
    // Auto-fill custom creator with this preset's colors immediately so user can tweak it
    // We don't save this as 'custom' yet, just prep the UI
    const theme = THEMES[themeName];
    if (theme) {
        // Values might be in local scope if we don't re-query DOM, 
        // but 'renderSettings' refreshes DOM, so we need to set values after render.
        // However, 'renderSettings' uses template literals which are evaluated *now*.
        // So we actually need to change how renderSettings *gets* its default values.
    }
}

function updateTheme() {
    const root = document.documentElement;
    if (STATE.theme === 'custom' && STATE.customTheme) {
        Object.keys(STATE.customTheme).forEach(key => {
            root.style.setProperty(key, STATE.customTheme[key]);
        });
    } else {
        const theme = THEMES[STATE.theme] || THEMES['default'];
        if (theme) {
            Object.keys(theme).forEach(key => {
                root.style.setProperty(key, theme[key]);
            });
        }
    }
}

function resetData() {
    showModal({
        title: 'Reset All Data?',
        message: 'This will wipe all expense entries. Members will remain. Cannot be undone.',
        type: 'confirm',
        confirmText: 'Reset Forever',
        danger: true,
        onConfirm: () => {
             STATE.entries = [];
             STATE.members.forEach(m => m.deposit = 0); 
             saveState();
             location.reload();
        }
    });
}

// --- Export Logic ---
window.exportDashboard = function() {
    const stats = calculateStats();
    const month = STATE.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const today = new Date().toLocaleDateString();

    const exportContainer = document.getElementById('export-container');
    
    // High-res layout, wider container for Full HD feel
    exportContainer.style.width = '1920px'; 
    
    exportContainer.innerHTML = `
        <div class="export-layout" style="width: 1920px; min-height: 1080px; padding: 100px; display: flex; flex-direction: column; justify-content: center; background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));">
            <div class="export-header" style="text-align: center; margin-bottom: 80px;">
                <h1 style="font-size: 6rem; font-weight: 800; color: var(--primary-color); letter-spacing: -2px; margin-bottom: 20px;">MEAL MANAGEMENT REPORT</h1>
                <h2 style="color: var(--text-muted); font-size: 3.5rem; font-weight: 400;">${month}</h2>
            </div>
            
            <!-- Summary in a row -->
            <!-- Summary in a row -->
            <div style="display: flex; justify-content: space-around; gap: 40px; margin-bottom: 100px; width: 100%;">
                <div style="flex: 1; text-align: center; padding: 50px; border-radius: 30px; border: 1px solid var(--surface-border); background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));">
                    <div style="font-size: 2.9rem; color: var(--text-muted); margin-bottom: 15px;">Total Meals</div>
                    <div style="font-size: 6rem; font-weight: 800; line-height: 1; color: var(--text-main);">${stats.totalMeals}</div>
                </div>
                <div style="flex: 1; text-align: center; padding: 50px; border-radius: 30px; border: 1px solid var(--surface-border); background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));">
                    <div style="font-size: 2.9rem; color: var(--text-muted); margin-bottom: 15px;">Total Cost</div>
                    <div style="font-size: 6rem; font-weight: 800; line-height: 1; color: var(--text-main);">${stats.totalCost}</div>
                </div>
                <div style="flex: 1; text-align: center; padding: 50px; border-radius: 30px; border: 1px solid var(--surface-border); background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));">
                    <div style="font-size: 2.9rem; color: var(--text-muted); margin-bottom: 15px;">Meal Rate</div>
                    <div style="font-size: 6rem; font-weight: 800; line-height: 1; color: var(--text-main);">${stats.mealRate.toFixed(2)}</div>
                </div>
            </div>
            
            <div style="margin: 0 auto; width: 100%; padding: 80px; border-radius: 50px; border: 1px solid var(--surface-border); background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));">
                <h3 style="text-align: center; font-size: 4.5rem; margin-bottom: 60px; color: var(--text-main); font-weight: 700;">Balance Overview</h3>
                <table class="balance-table" style="font-size: 3rem; width: 100%; border-collapse: separate; border-spacing: 0 20px;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--surface-border);">
                            <th style="padding: 20px; text-align: left; color: var(--text-muted); font-size: 2.9rem;">Member</th>
                            <th style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 2.9rem;">Meals</th>
                            <th style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 2.9rem;">Paid</th>
                            <th style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 2.9rem;">Cost</th>
                            <th style="padding: 20px; text-align: right; color: var(--text-muted); font-size: 2.9rem;">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${STATE.members.map(m => {
                            const mStats = stats.memberStats[m.id];
                            const balance = mStats.deposit - mStats.cost;
                            return `
                                <tr>
                                    <td style="padding: 25px; text-align: left; font-size: 3.5rem; font-weight: 600;">${m.name}</td>
                                    <td style="padding: 25px; text-align: center; font-size: 3.5rem;">${mStats.meals}</td>
                                    <td style="padding: 25px; text-align: center; font-size: 3.5rem;">${mStats.deposit}</td>
                                    <td style="padding: 25px; text-align: center; font-size: 3.5rem;">${mStats.cost.toFixed(0)}</td>
                                    <td style="padding: 25px; text-align: right; color: ${balance >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}; font-size: 4rem; font-weight: 800;">
                                        ${balance >= 0 ? '+' : ''}${balance.toFixed(0)}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>

            <div class="export-footer" style="margin-top: 100px; text-align: center; font-size: 2rem; color: var(--text-muted); opacity: 0.8;">
                <p>Report Generated on: ${today}</p>
                <p style="margin-top:15px; font-size: 1.8rem; letter-spacing: 2px;">MESS MANAGEMENT SYSTEM</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        html2canvas(exportContainer.querySelector('.export-layout'), {
            scale: 1, // Already 1920px wide, scale 1 is enough for high quality
            useCORS: true,
            backgroundColor: null,
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Mess_Report_${month.replace(' ', '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            exportContainer.innerHTML = '';
            exportContainer.style.width = ''; 
        });
    }, 800);
}

function toggleCustomTheme() {
    const wrapper = document.getElementById('custom-theme-wrapper');
    const icon = document.getElementById('theme-toggle-icon');
    
    if (wrapper.style.display === 'none') {
        wrapper.style.display = 'block';
        icon.innerText = 'expand_less';
        // Add a small fade in
        wrapper.style.opacity = 0;
        setTimeout(() => wrapper.style.opacity = 1, 10);
    } else {
        wrapper.style.display = 'none';
        icon.innerText = 'expand_more';
    }
}
