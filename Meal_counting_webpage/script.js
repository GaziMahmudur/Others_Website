// Configuration
const NAMES = ["Ashik", "Gazi", "Ibrahim", "Shuvo"];
const INPUT_IDS = { meals: ["ashikMeals", "gaziMeals", "ibrahimMeals", "shuvoMeals"], bazars: ["ashikBazar", "gaziBazar", "ibrahimBazar", "shuvoBazar"] };

// Step navigation & utility
function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById("step" + step) ? .classList.add('active');
    document.querySelector(`#step${step} input`) ? .focus();
}

function goBack(step) {
    step >= 0 && goToStep(step);
}

function clearInputs() {
    document.querySelectorAll(".container input").forEach(i => i.value = "");
}

// Enter key navigation
document.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const activeStep = document.querySelector(".form-step.active");
        if (!activeStep) return;
        const inputs = Array.from(activeStep.querySelectorAll("input"));
        const idx = inputs.indexOf(document.activeElement);
        if (idx > -1) {
            e.preventDefault();
            if (idx < inputs.length - 1) inputs[idx + 1].focus();
            else(activeStep.querySelector(".next-btn") || activeStep.querySelector(".finish-btn")) ? .click();
        }
    }
});

// Mobile keyboard scroll - attach dynamically
const attachScrollOnFocus = () => {
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("focus", () => {
            setTimeout(() => input.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
        });
    });
};

// Update date
const updateResultDate = () => {
    const el = document.getElementById("resultDate");
    if (el) el.textContent = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Build result HTML
function buildResultHTML(names, meals, bazars, totalMeals, totalBazar, mealRate) {
    const rows = names.map((name, i) => {
        const mealCost = meals[i] * mealRate;
        const balance = mealCost - bazars[i];
        const balanceClass = balance > 0 ? 'positive' : 'negative';
        const balanceValue = balance > 0 ? `+${balance.toFixed(2)}` : balance.toFixed(2);
        return `<tr><td>${name}</td><td>${meals[i]}</td><td>${bazars[i]}</td><td>${mealCost.toFixed(2)}</td><td><span class="${balanceClass}">${balanceValue}</span></td></tr>`;
    }).join('');

    return `<div class="summary"><p class="summary-stats">
        <span><strong>Total_Meals:</strong> ${totalMeals}</span>
        <span><strong>Total_Bazar:</strong> ${totalBazar} Tk</span>
        <span><strong>Meal_Rate:</strong> ${mealRate.toFixed(2)} Tk</span>
    </p></div>
    <table class="result-table"><thead><tr><th>Name</th><th>Meals</th><th>Bazar</th><th>Meal Cost</th><th>Balance</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// Calculate and display results
function calculate() {
    const meals = INPUT_IDS.meals.map(id => parseInt(document.getElementById(id).value) || 0);
    const bazars = INPUT_IDS.bazars.map(id => parseInt(document.getElementById(id).value) || 0);
    const totalMeals = meals.reduce((a, b) => a + b, 0);

    if (totalMeals === 0 || !bazars.some(b => b > 0)) {
        alert("Please enter valid meal and bazar values.");
        return;
    }

    const totalBazar = bazars.reduce((a, b) => a + b, 0);
    const mealRate = totalBazar / totalMeals;

    document.getElementById("result").innerHTML = buildResultHTML(NAMES, meals, bazars, totalMeals, totalBazar, mealRate);
    updateResultDate();
    goToStep(3);
}

// Export result as image
function exportResultImage() {
    const result = document.getElementById("result");
    if (!result ? .innerHTML.trim()) {
        alert("No result to export. Please calculate first.");
        return;
    }

    const clone = result.cloneNode(true);
    const exportContainer = document.createElement("div");
    const vw = Math.max(window.innerWidth, 360);
    const vh = Math.max(window.innerHeight, 640);

    exportContainer.className = "export-container";
    exportContainer.style.cssText = `width:${vw}px;height:${vh}px`;

    const mast = document.createElement('div');
    mast.className = 'export-mast';
    mast.textContent = new Date().toLocaleString();
    exportContainer.appendChild(mast);

    clone.className = 'export-clone';
    clone.style.cssText = `max-width:${Math.max(vw - 120, 360)}px`;
    exportContainer.appendChild(clone);
    document.body.appendChild(exportContainer);

    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));
    html2canvas(exportContainer, {
        scale: dpr,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        width: exportContainer.offsetWidth,
        height: exportContainer.offsetHeight,
        windowWidth: exportContainer.offsetWidth,
        windowHeight: exportContainer.offsetHeight,
        useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `meal-${new Date().toISOString().slice(0,10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        document.body.removeChild(exportContainer);
    }).catch(err => {
        document.body.removeChild(exportContainer);
        alert("Export error: " + err);
    });
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    updateResultDate();
    attachScrollOnFocus();
    document.getElementById("inlineExportBtn") ? .addEventListener("click", exportResultImage);
});