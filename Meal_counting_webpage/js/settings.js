// Settings & Customization

function renderSettings(container) {
    const { themeMode, textSize, accentColor, recentColors } = STATE.settings;

    container.innerHTML = `
        <h2 class="section-title">Settings</h2>

        <!-- PWA Install Button -->
        <button id="pwa-install-btn" class="btn" style="width:100%; margin-bottom: 20px; background: linear-gradient(135deg, #00C6FB, #005BEA); display: none;" onclick="installPWA()">
            <span class="material-icons-round">download</span> Install App
        </button>

        <!-- Theme Mode -->
        <div class="settings-group">
            <span class="settings-label">Theme</span>
            <div class="btn-group">
                <button class="btn-group-item ${themeMode === 'system' ? 'active' : ''}" onclick="setThemeMode('system')">System Default</button>
                <button class="btn-group-item ${themeMode === 'light' ? 'active' : ''}" onclick="setThemeMode('light')">Light</button>
                <button class="btn-group-item ${themeMode === 'dark' ? 'active' : ''}" onclick="setThemeMode('dark')">Dark</button>
            </div>
        </div>

        <!-- Text Size -->
        <div class="settings-group">
            <span class="settings-label">Text size</span>
            <div class="btn-group">
                ${Object.keys(TEXT_SIZES).map(size => `
                    <button class="btn-group-item ${textSize === size ? 'active' : ''}" onclick="setTextSize('${size}')">${size.toUpperCase()}</button>
                `).join('')}
            </div>
        </div>

        <!-- Accent Color -->
        <div class="settings-group">
            <span class="settings-label">Choose your accent color</span>
            
            <!-- Windows Colors -->
            <div class="color-section-title">Windows colors</div>
            <div class="color-grid">
                ${WINDOWS_COLORS.map(c => `
                    <div class="color-option ${accentColor === c.hex ? 'active' : ''}" 
                         style="background-color: ${c.hex};"
                         title="${c.name}"
                         onclick="setAccentColor('${c.hex}')"></div>
                `).join('')}
            </div>
            
            <!-- Custom Color -->
            <div class="windows-checkbox" style="margin-top: 20px;">
                <div class="custom-color-btn" onclick="ColorPicker.open(STATE.settings.accentColor, setAccentColor)">
                    <span class="material-icons-round">add</span>
                </div>
                <span style="margin-left: 10px; cursor: pointer;" onclick="ColorPicker.open(STATE.settings.accentColor, setAccentColor)">Custom color</span>
            </div>
        </div>
        
        <button class="btn" style="width:100%; background: var(--danger-color); margin-top: 20px;" onclick="resetData()">
            Reset All Data
        </button>
    `;

    // Check deferredPrompt again after rendering
    setTimeout(() => {
        if (window.deferredPrompt) {
            const btn = document.getElementById('pwa-install-btn');
            if (btn) btn.style.display = 'flex';
        }
    }, 0);
}

function setThemeMode(mode) {
    STATE.settings.themeMode = mode;
    saveState();
    updateTheme();
    renderSettings(document.getElementById('main-content'));
}

function setTextSize(size) {
    STATE.settings.textSize = size;
    saveState();
    updateTheme();
    renderSettings(document.getElementById('main-content'));
}

function setAccentColor(color) {
    STATE.settings.accentColor = color;

    // Manage Recent Colors
    let recent = STATE.settings.recentColors || [];
    // Remove if exists
    recent = recent.filter(c => c !== color);
    // Add to front
    recent.unshift(color);
    // Limit to 5
    if (recent.length > 5) recent.pop();

    STATE.settings.recentColors = recent;

    saveState();
    updateTheme();
    renderSettings(document.getElementById('main-content'));
}

function resetData() {
    showModal({
        title: 'Reset All Data?',
        message: 'This will wipe all expense entries. Members will remain. Cannot be undone.',
        type: 'confirm',
        confirmText: 'Reset Forever',
        danger: true,
        onConfirm: () => {
            // Factory Reset
            localStorage.removeItem('messAppState');
            location.reload();
        }
    });
}

function toggleCustomTheme() {
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

// --- Custom Color Picker (Windows 11 Style) ---
window.ColorPicker = {
    showDetails: false,
    h: 0, s: 100, v: 100,
    callback: null,
    isDraggingSpectrum: false,
    isDraggingSlider: false,

    open(initialHex, onSave) {
        this.callback = onSave;
        const hsv = this.hexToHsv(initialHex || '#70ffaf');
        this.h = hsv.h;
        this.s = hsv.s;
        this.v = hsv.v;
        this.showDetails = false;

        let modal = document.getElementById('cp-overlay');
        if (!modal) {
            this.createModal();
            modal = document.getElementById('cp-overlay');
        }

        modal.classList.add('active');
        this.updateUI();
    },

    close() {
        const modal = document.getElementById('cp-overlay');
        if (modal) modal.classList.remove('active');
    },

    save() {
        if (this.callback) {
            this.callback(this.hsvToHex(this.h, this.s, this.v));
        }
        this.close();
    },

    createModal() {
        const div = document.createElement('div');
        div.id = 'cp-overlay';
        div.className = 'cp-overlay';
        div.innerHTML = `
            <div class="cp-modal">
                <div class="cp-title-bar">
                    <h3 class="cp-title">Choose a custom accent color</h3>
                </div>
                
                <div class="cp-body">
                    <!-- Spectrum Box + Side Bar -->
                    <div class="cp-main-area">
                        <div class="cp-spectrum-box" id="cp-spectrum">
                            <div class="cp-spectrum-handle" id="cp-handle"></div>
                        </div>
                        <!-- Current Color Bar (Right Side) -->
                        <div class="cp-current-color-bar" id="cp-current-bar"></div>
                    </div>

                    <!-- Value Slider (Bottom) -->
                    <div class="cp-slider-track" id="cp-slider-track">
                        <div class="cp-slider-handle" id="cp-slider-handle"></div>
                    </div>

                    <div class="cp-toggle-more" onclick="ColorPicker.toggleMore()">
                        <span id="cp-more-text">More</span> <span class="material-icons-round" id="cp-more-icon" style="font-size:16px; vertical-align:middle;">expand_more</span>
                    </div>

                    <div class="cp-details" id="cp-details">
                        <!-- Top Row: Select & Hex (Spans full width) -->
                        <div style="grid-column: 1 / -1; display: flex; gap: 40px;">
                             <div class="cp-input-row" style="flex: 1;">
                                <select class="cp-select">
                                    <option>RGB</option>
                                    <option>HSV</option>
                                </select>
                            </div>
                             <div class="cp-input-row">
                                <input type="text" class="cp-input" id="cp-hex" value="#70ffaf" onchange="ColorPicker.inputHex(this.value)">
                            </div>
                        </div>

                        <!-- Numeric Inputs Column (Left) -->
                        <div class="cp-inputs-column">
                            <div class="cp-input-row">
                                <input type="number" class="cp-input" id="cp-r" min="0" max="255" onchange="ColorPicker.inputRGB()">
                                <span class="cp-label">Red</span>
                            </div>
                            <div class="cp-input-row">
                                <input type="number" class="cp-input" id="cp-g" min="0" max="255" onchange="ColorPicker.inputRGB()">
                                <span class="cp-label">Green</span>
                            </div>
                            <div class="cp-input-row">
                                <input type="number" class="cp-input" id="cp-b" min="0" max="255" onchange="ColorPicker.inputRGB()">
                                <span class="cp-label">Blue</span>
                            </div>
                        </div>
                        
                        <!-- Right Column (Empty for now as Hex moved up) -->
                        <div class="cp-inputs-column"></div> 
                    </div>

                    <!-- Preview Grid (Restored to bottom) -->
                    <div class="cp-preview-title">Color preview</div>
                    <div class="cp-preview-grid">
                        <!-- Top Row -->
                        <div class="cp-preview-box" id="cp-pre-1" style="background: #0078D4; color: white;">Preview</div>
                        <div class="cp-preview-box" id="cp-pre-2" style="background: #0078D4; color: white;">Preview</div>
                        
                        <!-- Bottom Row -->
                        <div class="cp-preview-box" id="cp-pre-3" style="background: #000; color: #0078D4;">Preview</div>
                        <div class="cp-preview-box" id="cp-pre-4" style="background: #d9d9d9; color: #0078D4;">Preview</div>
                    </div>

                </div>

                <div class="cp-footer">
                    <button class="cp-btn primary" onclick="ColorPicker.save()">Done</button>
                    <button class="cp-btn" onclick="ColorPicker.close()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        // Events
        const spectrum = document.getElementById('cp-spectrum');
        const slider = document.getElementById('cp-slider-track');

        spectrum.onmousedown = (e) => this.startSpectrum(e);
        slider.onmousedown = (e) => this.startSlider(e);
        window.addEventListener('mousemove', e => this.handleMove(e));
        window.addEventListener('mouseup', () => this.stopDrag());

        // Touch
        spectrum.addEventListener('touchstart', (e) => { e.preventDefault(); this.startSpectrum(e); }, { passive: false });
        slider.addEventListener('touchstart', (e) => { e.preventDefault(); this.startSlider(e); }, { passive: false });
        window.addEventListener('touchmove', e => this.handleMove(e), { passive: false });
        window.addEventListener('touchend', () => this.stopDrag());
    },

    startSpectrum(e) {
        this.isDraggingSpectrum = true;
        this.updateSpectrumFromPointer(e);
    },

    startSlider(e) {
        this.isDraggingSlider = true;
        this.updateSliderFromPointer(e);
    },

    stopDrag() {
        this.isDraggingSpectrum = false;
        this.isDraggingSlider = false;
    },

    toggleMore() {
        this.showDetails = !this.showDetails;
        this.updateUI();
    },

    handleMove(e) {
        if (this.isDraggingSpectrum) {
            if (e.cancelable) e.preventDefault();
            this.updateSpectrumFromPointer(e);
        }
        if (this.isDraggingSlider) {
            if (e.cancelable) e.preventDefault();
            this.updateSliderFromPointer(e);
        }
    },

    getPointerPos(e) {
        let x, y;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        return { x, y };
    },

    updateSpectrumFromPointer(e) {
        const box = document.getElementById('cp-spectrum').getBoundingClientRect();
        const { x: clientX, y: clientY } = this.getPointerPos(e);

        let x = clientX - box.left;
        let y = clientY - box.top;

        x = Math.max(0, Math.min(x, box.width));
        y = Math.max(0, Math.min(y, box.height));

        this.h = (x / box.width) * 360;
        this.s = 100 - (y / box.height) * 100;

        this.updateUI();
    },

    updateSliderFromPointer(e) {
        const track = document.getElementById('cp-slider-track').getBoundingClientRect();
        const { x: clientX } = this.getPointerPos(e);

        let x = clientX - track.left;
        x = Math.max(0, Math.min(x, track.width));

        this.v = (x / track.width) * 100;

        this.updateUI();
    },

    updateUI() {
        const hex = this.hsvToHex(this.h, this.s, this.v);
        const pureHex = this.hsvToHex(this.h, this.s, 100);

        // Fixed ID from 'cp-current-color-bar' to 'cp-current-bar' as per HTML creation
        const bar = document.getElementById('cp-current-bar');
        if (bar) bar.style.background = hex;

        const details = document.getElementById('cp-details');
        const moreIcon = document.getElementById('cp-more-icon');
        if (details) {
            if (this.showDetails) {
                details.classList.add('open');
                if (moreIcon) moreIcon.innerText = 'expand_less';
            } else {
                details.classList.remove('open');
                if (moreIcon) moreIcon.innerText = 'expand_more';
            }
        }

        const handle = document.getElementById('cp-handle');
        if (handle) {
            handle.style.left = (this.h / 360) * 100 + '%';
            handle.style.top = (100 - this.s) + '%';
        }

        const sHandle = document.getElementById('cp-slider-handle');
        const sTrack = document.getElementById('cp-slider-track');
        if (sHandle) sHandle.style.left = this.v + '%';
        if (sTrack) {
            sTrack.style.background = `linear-gradient(to right, black, ${pureHex})`;
        }

        const iHex = document.getElementById('cp-hex');
        const rgb = this.hsvToRgb(this.h, this.s, this.v);
        if (iHex) iHex.value = hex;
        if (document.getElementById('cp-r')) document.getElementById('cp-r').value = rgb.r;
        if (document.getElementById('cp-g')) document.getElementById('cp-g').value = rgb.g;
        if (document.getElementById('cp-b')) document.getElementById('cp-b').value = rgb.b;

        // Preview 1 (Top Left): Current Color, White Text
        const p1 = document.getElementById('cp-pre-1');
        if (p1) {
            p1.style.background = hex;
            p1.style.color = '#fff';
        }

        // Preview 2 (Top Right): Deeper Tone Background, Text = Current Color
        // Logic: Reduce V by 30% for "deeper tone" or use black if very dark
        const p2 = document.getElementById('cp-pre-2');
        if (p2) {
            // Create a deeper tone by reducing Value (V)
            const deepHex = this.hsvToHex(this.h, this.s, Math.max(0, this.v - 30));
            p2.style.background = deepHex;
            p2.style.color = hex;
        }

        // Preview 3 & 4: Text = Current Color
        const p3 = document.getElementById('cp-pre-3'); // Black BG
        if (p3) p3.style.color = hex;

        const p4 = document.getElementById('cp-pre-4'); // Grey BG
        if (p4) p4.style.color = hex;
    },

    inputRGB() {
        const r = parseInt(document.getElementById('cp-r').value) || 0;
        const g = parseInt(document.getElementById('cp-g').value) || 0;
        const b = parseInt(document.getElementById('cp-b').value) || 0;
        const hsv = this.rgbToHsv(r, g, b);
        this.h = hsv.h; this.s = hsv.s; this.v = hsv.v;
        this.updateUI();
    },

    inputHex(val) {
        if (!val.startsWith('#')) val = '#' + val;
        const hsv = this.hexToHsv(val);
        this.h = hsv.h; this.s = hsv.s; this.v = hsv.v;
        this.updateUI();
    },

    hsvToRgb(h, s, v) {
        s /= 100; v /= 100;
        let c = v * s;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = v - c;
        let r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    },

    rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, v = max;
        let d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max === min) h = 0;
        else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: (h || 0) * 360, s: s * 100, v: v * 100 };
    },

    hsvToHex(h, s, v) {
        const rgb = this.hsvToRgb(h, s, v);
        const r = rgb.r.toString(16).padStart(2, '0');
        const g = rgb.g.toString(16).padStart(2, '0');
        const b = rgb.b.toString(16).padStart(2, '0');
        return ("#" + r + g + b).toUpperCase();
    },

    hexToHsv(hex) {
        if (hex.startsWith('#')) hex = hex.slice(1);
        let r = 0, g = 0, b = 0;
        if (hex.length === 3) {
            r = "0x" + hex[0] + hex[0];
            g = "0x" + hex[1] + hex[1];
            b = "0x" + hex[2] + hex[2];
        } else if (hex.length >= 6) {
            r = "0x" + hex.substring(0, 2);
            g = "0x" + hex.substring(2, 4);
            b = "0x" + hex.substring(4, 6);
        }
        return this.rgbToHsv(+r, +g, +b);
    }
};
