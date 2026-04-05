// Daily Entry & Date Picker

window.evaluateMath = function(str) {
    if (!str) return '';
    try {
        // Sanitize strictly to allow only basic math
        const sanitized = String(str).replace(/[^0-9+\-*/(). ]/g, '');
        if (sanitized !== str && sanitized.trim().length === 0) return '';
        
        // Safely parse
        const result = new Function('return ' + sanitized)();
        if (!isFinite(result) || isNaN(result)) return str;
        
        return Number.isInteger(result) ? result : parseFloat(result.toFixed(2));
    } catch (e) {
        return str; // Return as-is if invalid
    }
};

window.appendPlus = function(btn) {
    const input = btn.previousElementSibling;
    if (input) {
        let val = input.value.trim();
        // Don't double append plus
        if (val && !/[+\-*/]$/.test(val)) {
            val = window.evaluateMath(val);
            input.value = val + ' + ';
        }
        input.focus();
    }
};

function renderDailyEntry(container) {
    // Default to the currently selected month in STATE
    const year = STATE.currentMonth.getFullYear();
    const month = String(STATE.currentMonth.getMonth() + 1).padStart(2, '0');
    const currentMonthStr = `${year}-${month}`;

    const html = `
        <h2 class="section-title">Monthly Entry</h2>
        <div class="surface-card surface-card-interactive input-group">
             <label>Select Month</label>
             <div class="input-with-icon" onclick="openMonthPicker()">
                 <!-- Display Input (Read Only) -->
                 <input type="text" value="${STATE.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}" 
                        class="input-field with-icon-right" id="entryDateDisplay" readonly style="cursor: pointer;">
                 <span class="material-icons-round input-icon right">expand_more</span>
                 
                 <!-- Hidden Actual Value Input for Save Logic -->
                 <input type="hidden" value="${currentMonthStr}" id="entryDate">
             </div>
        </div>
        
        <div id="members-entry-list">
            ${STATE.members.map((m, index) => `
                <div class="surface-card surface-card-interactive entry-card row-pop" style="animation-delay: ${index * 0.05}s">
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
                        <!-- Smart Inline Calculator Input for Bazar with Unified Stepper Design -->
                        <div class="stepper-control stepper-bazar">
                            <input type="text" inputmode="tel" placeholder="0" class="stepper-input member-bazar-input calc-enabled" data-id="${m.id}" style="text-align: left; padding-left: 14px; font-family: 'Segoe UI', monospace; font-size: 1.05rem;">
                            <button type="button" class="stepper-btn" onclick="appendPlus(this)" title="Add (+) to calculate sum">
                                <span class="material-icons-round" style="font-size: 1.25rem;">add</span>
                            </button>
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

    // Advanced Enter Key Navigation for Entry Form (including calculated fields)
    const inputs = Array.from(container.querySelectorAll('input[type="number"], .calc-enabled'));
    inputs.forEach((input, index) => {
        
        // If it's the custom calculator field, we evaluate it on leaving
        if (input.classList.contains('calc-enabled')) {
            input.addEventListener('blur', function() {
                this.value = window.evaluateMath(this.value);
            });
        }

        input.addEventListener('keydown', (e) => {
            // Meals Hotkeys: Keys '+' and '-'
            if (input.classList.contains('member-meal-input')) {
                const id = input.dataset.id;
                if (e.key === '+') {
                    e.preventDefault();
                    window.updateStepper(id, 'meal', 1);
                    const btn = input.nextElementSibling;
                    if(btn) { btn.classList.add('active-sim'); setTimeout(()=>btn.classList.remove('active-sim'), 100); }
                    return;
                }
                if (e.key === '-') {
                    e.preventDefault();
                    window.updateStepper(id, 'meal', -1);
                    const btn = input.previousElementSibling;
                    if(btn) { btn.classList.add('active-sim'); setTimeout(()=>btn.classList.remove('active-sim'), 100); }
                    return;
                }
            }

            // Bazar Hotkey: Key '+'
            if (input.classList.contains('member-bazar-input') && input.classList.contains('calc-enabled')) {
                if (e.key === '+') {
                    e.preventDefault();
                    let val = input.value.trim();
                    if (val && !/[+\-*/]$/.test(val)) {
                        val = window.evaluateMath(val);
                        input.value = val + ' + ';
                    }
                    const btn = input.nextElementSibling;
                    if(btn) { btn.classList.add('active-sim'); setTimeout(()=>btn.classList.remove('active-sim'), 100); }
                    return;
                }
            }

            if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                
                // If it's a calc-enabled field, immediately compute on enter
                if (input.classList.contains('calc-enabled')) {
                    input.value = window.evaluateMath(input.value);
                }

                // If user just pressed '=', compute but stay in the field
                if (e.key === '=') return;

                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                    if(nextInput.select) nextInput.select();
                } else {
                    // Trigger visual click on save button
                    const saveBtn = container.querySelector('.btn-inline-save');
                    if (saveBtn) {
                        saveBtn.focus(); // Move focus to button
                        saveBtn.click(); // Trigger click
                    } else {
                        saveEntry();
                    }
                }
            }
        });

        // Robust Auto-scroll on focus for mobile keyboards
        input.addEventListener('focus', function () {
            setTimeout(() => {
                const rect = this.getBoundingClientRect();
                const absoluteTop = window.scrollY + rect.top;
                const buffer = window.innerHeight / 3; // Position in upper third of screen

                window.scrollTo({
                    top: absoluteTop - buffer,
                    behavior: 'smooth'
                });
            }, 400);
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
    if (currentVal) {
        pickerYear = parseInt(currentVal.split('-')[0]);
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'custom-month-picker';

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMonthPicker();
    });

    document.body.appendChild(modal);
    renderCustomMonthPicker();
}

function renderCustomMonthPicker() {
    const modal = document.getElementById('custom-month-picker');
    if (!modal) return;

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
                <div class="year-text-container">
                    <span id="picker-year-text">${pickerYear}</span>
                </div>
                <button class="btn-icon-only" onclick="changePickerYear(1)">
                    <span class="material-icons-round">chevron_right</span>
                </button>
            </div>
            <div class="month-grid" id="picker-month-grid">
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
    const yearText = document.getElementById('picker-year-text');
    if (!yearText) {
        pickerYear += delta;
        renderCustomMonthPicker();
        return;
    }

    const dir = delta > 0 ? 'next' : 'prev';
    const exitClass = dir === 'next' ? 'year-slide-next-exit' : 'year-slide-prev-exit';
    const enterClass = dir === 'next' ? 'year-slide-next-enter' : 'year-slide-prev-enter';

    // 1. Animate Out
    yearText.className = ''; // reset
    yearText.classList.add(exitClass);

    setTimeout(() => {
        // 2. Update Value
        pickerYear += delta;
        yearText.innerText = pickerYear;

        // 3. Animate In
        yearText.className = '';
        yearText.classList.add(enterClass);

        // 4. Update Grid Highlights (Silent Update)
        updatePickerGrid();
    }, 200); // Wait for exit animation
}

function updatePickerGrid() {
    const grid = document.getElementById('picker-month-grid');
    if (!grid) return;

    // Calculate currently active month
    const currentVal = document.getElementById('entryDate') ? document.getElementById('entryDate').value : '';
    const selectedMonth = (currentVal && parseInt(currentVal.split('-')[0]) === pickerYear)
        ? parseInt(currentVal.split('-')[1]) - 1
        : -1;

    const btns = grid.querySelectorAll('.month-btn');
    btns.forEach((btn, index) => {
        if (index === selectedMonth) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function selectPickerMonth(monthIndex) {
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const fullStr = `${pickerYear}-${monthStr}`;

    // Update Hidden Input (Logic)
    const entryDateInput = document.getElementById('entryDate');
    if (entryDateInput) entryDateInput.value = fullStr;

    // Update Display Input (Visual)
    const displayInput = document.getElementById('entryDateDisplay');
    if (displayInput) {
        const date = new Date(pickerYear, monthIndex);
        displayInput.value = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    closeMonthPicker();
}

function closeMonthPicker() {
    const modal = document.getElementById('custom-month-picker');
    if (modal) {
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
        // Double check evaluation in case they click save while still typing
        const evaluatedVal = window.evaluateMath(input.value);
        const val = parseInt(evaluatedVal);
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
    if (date.length === 7) {
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
