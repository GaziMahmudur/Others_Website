// History Component

function renderHistory(container) {
    const sorted = [...STATE.entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        container.innerHTML = `
            <h2 class="section-title">History</h2>
            <div class="surface-card" style="text-align:center; padding:40px; color:var(--text-muted);">
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
                    <div class="history-table-wrapper">
                        <table class="history-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th style="text-align: center;">M</th>
                                    <th style="text-align: center;">Paid</th>
                                    <th style="text-align: right;">Bal</th>
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
                                            <td>${m.name}</td>
                                            <td style="text-align: center;">${mMeals}</td>
                                            <td style="text-align: center;">${mBazar}</td>
                                            <td style="text-align: right;" class="${mBalance >= 0 ? 'balance-positive' : 'balance-negative'}">
                                                ${mBalance >= 0 ? '+' : ''}${Math.round(mBalance)}
                                            </td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>
                        <div class="history-rate">
                            Meal Rate: ${entryMealRate.toFixed(2)}
                        </div>
                    </div>
                `;

        return `
                <div class="history-item">
                    <div class="history-header">
                        <div class="history-date">
                            <span>${new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                            <span>${new Date(entry.date).getFullYear()}</span>
                        </div>
                        <div class="history-summary">
                            <div class="history-meals">${totalM} Meals</div>
                            <div class="history-bazar">+ ${totalB} Bazar</div>
                        </div>
                    </div>
                    
                    <button class="btn-icon-only btn-icon-danger" 
                            style="position: absolute; top: 16px; right: 16px; width: 32px; height: 32px;"
                            onclick="event.stopPropagation(); deleteEntry(${originalIndex})">
                        <span class="material-icons-round" style="font-size: 18px;">delete</span>
                    </button>
                    
                    <button class="history-view-btn" onclick="toggleHistory(this.parentElement)">
                        <span>See Details</span>
                        <span class="material-icons-round">expand_more</span>
                    </button>

                    <div class="history-details">
                        <div class="history-details-inner">
                            ${details || 'No data available'}
                        </div>
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

window.toggleHistory = function (card) {
    card.classList.toggle('expanded');

    // Toggle Button Text
    const btnText = card.querySelector('.history-view-btn span:first-child');
    if (card.classList.contains('expanded')) {
        btnText.innerText = 'Hide Details';
    } else {
        btnText.innerText = 'See Details';
    }
}
