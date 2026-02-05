// History Component

function renderHistory(container) {
    const sorted = [...STATE.entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        container.innerHTML = `
            <h2 class="section-title">History</h2>
            <div class="surface surface-card" style="text-align:center; padding:40px; color:var(--text-muted);">
                No history entries yet.
            </div>
        `;
        return;
    }

    const html = `
        <h2 class="section-title">History</h2>
        <div class="history-list">
            ${sorted.map((entry) => {
        const totalM = Object.values(entry.meals).reduce((a, b) => a + b, 0);
        const totalB = Object.values(entry.bazar || {}).reduce((a, b) => a + b, 0);

        const originalIndex = STATE.entries.indexOf(entry);

        const entryMealRate = totalM > 0 ? totalB / totalM : 0;

        const details = `
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; color: var(--text-muted);">
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

            if (mMeals === 0 && mBazar === 0) return '';

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
                        <div style="margin-top: 8px; font-size: 0.8rem; opacity: 0.6; text-align: right;">
                            Meal Rate: ${entryMealRate.toFixed(2)}
                        </div>
                    </div>
                `;

        return `
                <div class="glass glass-card history-item" onclick="toggleHistory(this)" style="position: relative;">
                    <div style="display:flex; justify-content:space-between; align-items:center; padding-right: 30px;">
                        <div class="history-date">
                            <span>${new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                            <span>${new Date(entry.date).getFullYear()}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: bold;">${totalM} Meals</div>
                            <div style="font-size: 0.9rem; color: var(--success-color);">+ ${totalB} Bazar</div>
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

window.toggleHistory = function (element) {
    const details = element.querySelector('.history-details');
    if (details.style.display === 'none') {
        details.style.display = 'block';
        element.style.background = 'rgba(255, 255, 255, 0.08)';
    } else {
        details.style.display = 'none';
        element.style.background = '';
    }
}
