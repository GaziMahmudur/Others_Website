// Dashboard, Stats, and Export Logic

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
        <div class="month-selector">
            <button class="btn btn-icon-only surface-card" onclick="changeMonth(-1)"><span class="material-icons-round">chevron_left</span></button>
            <div class="month-label-container">
                <span class="month-label">${month}</span>
            </div>
            <button class="btn btn-icon-only surface-card" onclick="changeMonth(1)"><span class="material-icons-round">chevron_right</span></button>
        </div>

        <div class="summary-grid">
            <div class="surface-card surface-card-interactive summary-card fadeInUp-stagger">
                <h3>Total Meals</h3>
                <div class="value">${stats.totalMeals}</div>
            </div>
             <div class="surface-card surface-card-interactive summary-card fadeInUp-stagger">
                <h3>Total Bazar</h3>
                <div class="value">${stats.totalCost}</div>
            </div>
            <div class="surface-card surface-card-interactive summary-card fadeInUp-stagger highlight">
                <h3>Meal Rate</h3>
                <div class="value">${stats.mealRate.toFixed(2)}</div>
            </div>
        </div>

        <!-- Charts Section -->
        ${stats.totalCost > 0 ? `
            <div class="surface-card surface-card-interactive fadeInUp-stagger">
                <div class="section-title">Expense Breakdown</div>
                <div class="chart-container">
                    <canvas id="costChart"></canvas>
                </div>
            </div>
        ` : ''}

        <div class="surface-card surface-card-interactive">
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
    if (stats.totalCost > 0) {
        setTimeout(() => drawCostChart(stats), 100);
    }
}

function drawCostChart(stats) {
    const ctx = document.getElementById('costChart');
    if (!ctx) return;

    // Prepare Data
    const labels = [];
    const data = [];
    const colors = [
        '#38bdf8', '#4ade80', '#f87171', '#f472b6', '#a78bfa', '#fbbf24'
    ]; // Just some nice colors

    Object.keys(stats.memberStats).forEach((id, index) => {
        const m = STATE.members.find(mem => mem.id == id);
        if (m) {
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
                if (memberStats[id]) {
                    memberStats[id].meals += count;
                    totalMeals += count;
                }
            });

            Object.entries(entry.bazar || {}).forEach(([id, amount]) => {
                totalCost += amount;
                if (memberStats[id]) {
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
    const label = document.querySelector('.month-selector .month-label');
    if (!label) {
        STATE.currentMonth.setMonth(STATE.currentMonth.getMonth() + delta);
        renderDashboard(document.getElementById('main-content'));
        return;
    }

    const dir = delta > 0 ? 'next' : 'prev';
    const exitClass = dir === 'next' ? 'year-slide-next-exit' : 'year-slide-prev-exit';

    // 1. Animate Out
    label.classList.add(exitClass);

    setTimeout(() => {
        // 2. Update State
        STATE.currentMonth.setMonth(STATE.currentMonth.getMonth() + delta);

        // 3. Re-render Dashboard (this will create new DOM with enter animation if we add it)
        // To make it smooth, we need renderDashboard to handle "enter" animation on the label if a transition just happened.
        // But since renderDashboard wipes HTML, we can just call it.
        // We'll trust the re-render is fast enough. 
        // For better UX, we could pass a flag or class to renderDashboard.
        renderDashboard(document.getElementById('main-content'));

        // 4. Animate In (New Element)
        const newLabel = document.querySelector('.month-selector .month-label');
        if (newLabel) {
            const enterClass = dir === 'next' ? 'year-slide-next-enter' : 'year-slide-prev-enter';
            newLabel.classList.add(enterClass);
        }
    }, 200);
}

window.exportDashboard = function () {
    const stats = calculateStats();
    const month = STATE.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const today = new Date().toLocaleDateString();

    const exportContainer = document.getElementById('export-container');

    // High-res layout, wider container for Full HD feel
    exportContainer.style.width = '1920px';

    exportContainer.innerHTML = `
        <div class="export-layout" style="width: 1920px; min-height: 1080px; padding: 100px; display: flex; flex-direction: column; justify-content: center; background: var(--background-color);">
            <div class="export-header" style="text-align: center; margin-bottom: 80px;">
                <h1 style="font-size: 6rem; font-weight: 800; color: var(--primary-color); letter-spacing: -2px; margin-bottom: 20px;">MEAL MANAGEMENT REPORT</h1>
                <h2 style="color: var(--text-muted); font-size: 3.5rem; font-weight: 400;">${month}</h2>
            </div>
            
            <!-- Summary in a row -->
            <div style="display: flex; justify-content: space-around; gap: 40px; margin-bottom: 100px; width: 100%;">
                <div style="flex: 1; text-align: center; padding: 50px; border-radius: 30px; border: 3px solid var(--surface-border); background: var(--surface-color);">
                    <div style="font-size: 2.9rem; color: var(--text-muted); margin-bottom: 15px;">Total Meals</div>
                    <div style="font-size: 6rem; font-weight: 800; line-height: 1; color: var(--text-main);">${stats.totalMeals}</div>
                </div>
                <div style="flex: 1; text-align: center; padding: 50px; border-radius: 30px; border: 3px solid var(--surface-border); background: var(--surface-color);">
                    <div style="font-size: 2.9rem; color: var(--text-muted); margin-bottom: 15px;">Total Cost</div>
                    <div style="font-size: 6rem; font-weight: 800; line-height: 1; color: var(--text-main);">${stats.totalCost}</div>
                </div>
                <div style="flex: 1; text-align: center; padding: 50px; border-radius: 30px; border: 3px solid var(--surface-border); background: var(--surface-color);">
                    <div style="font-size: 2.9rem; color: var(--text-muted); margin-bottom: 15px;">Meal Rate</div>
                    <div style="font-size: 6rem; font-weight: 800; line-height: 1; color: var(--text-main);">${stats.mealRate.toFixed(2)}</div>
                </div>
            </div>
            
            <div style="margin: 0 auto; width: 100%; padding: 80px; border-radius: 50px; border: 3px solid var(--surface-border); background: var(--surface-color);">
                <h3 style="text-align: center; font-size: 4.5rem; margin-bottom: 60px; color: var(--text-main); font-weight: 700;">Balance Overview</h3>
                <table class="balance-table" style="font-size: 3rem; width: 100%; border-collapse: separate; border-spacing: 0 20px;">
                    <thead>
                        <tr style="border-bottom: 4px solid var(--surface-border);">
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
