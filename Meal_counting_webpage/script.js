// ------------- Step navigation & utility -------------
function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    const el = document.getElementById("step" + step);
    if (el) el.classList.add('active');

    // focus first input
    const first = document.querySelector("#step" + step + " input");
    if (first) first.focus();
}

function goBack(step) {
    if (step >= 0) goToStep(step);
}

function clearInputs() {
    document.querySelectorAll(".container input").forEach(i => i.value = "");
}

// ------------- Enter navigation (robust) -------------
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        const activeStep = document.querySelector(".form-step.active");
        if (!activeStep) return;
        const inputs = Array.from(activeStep.querySelectorAll("input"));
        const idx = inputs.indexOf(document.activeElement);

        if (idx > -1) {
            e.preventDefault();
            if (idx < inputs.length - 1) {
                inputs[idx + 1].focus();
            } else {
                const nextBtn = activeStep.querySelector("button.next-btn");
                const finishBtn = activeStep.querySelector("button.finish-btn");
                if (nextBtn) nextBtn.click();
                else if (finishBtn) finishBtn.click();
            }
        }
    }
});

// mobile keyboard scroll fix
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
        setTimeout(() => input.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
    });
});

// ------------- Date in result (top-right) -------------
function formatDateForUI(d = new Date()) {
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString(undefined, opts);
}

function updateResultDate() {
    const el = document.getElementById("resultDate");
    if (el) el.textContent = formatDateForUI(new Date());
}
updateResultDate(); // initial

// ------------- Calculation logic -------------
function calculate() {
    const names = ["Ashik", "Gazi", "Ibrahim", "Shuvo"];
    const meals = [
        parseInt(document.getElementById("ashikMeals").value) || 0,
        parseInt(document.getElementById("gaziMeals").value) || 0,
        parseInt(document.getElementById("ibrahimMeals").value) || 0,
        parseInt(document.getElementById("shuvoMeals").value) || 0
    ];
    const bazars = [
        parseInt(document.getElementById("ashikBazar").value) || 0,
        parseInt(document.getElementById("gaziBazar").value) || 0,
        parseInt(document.getElementById("ibrahimBazar").value) || 0,
        parseInt(document.getElementById("shuvoBazar").value) || 0
    ];

    const totalMeals = meals.reduce((a, b) => a + b, 0);
    const totalBazar = bazars.reduce((a, b) => a + b, 0);
    const mealRate = totalMeals > 0 ? (totalBazar / totalMeals) : 0;

    // Build result HTML
    let html = `<div class="summary"><p style="margin-bottom: 20px;">
      <span style="margin-right:20px;"><strong>Total_Meals:</strong> ${totalMeals}</span>
      <span style="margin-right:20px;"><strong>Total_Bazar:</strong> ${totalBazar} Tk</span>
      <span><strong>Meal_Rate:</strong> ${mealRate.toFixed(2)} Tk</span>
    </p></div>`;

    html += `<table aria-describedby="mealSummary" style="font-size: 16px;"><thead>
    <tr><th>Name</th><th>Meals</th><th>Bazar</th><th>Meal Cost</th><th>Balance</th></tr>
  </thead><tbody>`;

    names.forEach((name, i) => {
        const mealCost = meals[i] * mealRate;
        const balance = mealCost - bazars[i];
        const balanceText = balance > 0 ?
            `<span class="positive">+${balance.toFixed(2)}</span>` :
            `<span class="negative">${balance.toFixed(2)}</span>`;
        html += `<tr>
      <td>${name}</td>
      <td>${meals[i]}</td>
      <td>${bazars[i]}</td>
      <td>${mealCost.toFixed(2)}</td>
      <td>${balanceText}</td>
    </tr>`;
    });

    html += `</tbody></table>`;

    document.getElementById("result").innerHTML = html;
    updateResultDate();
    // update export date text (if present)
    if (typeof updateExportDate === 'function') updateExportDate();
    goToStep(3);
}
// ----------------- Export (user-provided) -----------------
// Call this once you fill the result HTML to update the date text
function updateExportDate() {
    const dateStr = new Date().toLocaleString();
    const el = document.getElementById("exportDate");
    if (el) el.textContent = dateStr;
}

// Call updateExportDate() after generating the result content.

// Export image function (fixed size export container)
function exportResultImage() {
    const result = document.getElementById("result");

    if (!result || result.innerHTML.trim() === "") {
        alert("No result to export. Please calculate first.");
        return;
    }

    // Clone the result so we don't mess with the UI
    const clone = result.cloneNode(true);

    // Remove export button from clone to avoid it in the image
    const exportBtn = clone.querySelector(".export-btn") || clone.querySelector("#inlineExportBtn");
    if (exportBtn) exportBtn.remove();

    // Create container sized to the current viewport (fits whole screen)
    const exportContainer = document.createElement("div");
    const vw = Math.max(window.innerWidth, 360);
    const vh = Math.max(window.innerHeight, 640);
    exportContainer.style.width = `${vw}px`;
    exportContainer.style.height = `${vh}px`;
    exportContainer.style.background = "linear-gradient(135deg, #0d5546, #162e7a, #541f7a)";
    exportContainer.style.backgroundSize = "100% 100%"; // FULL coverage
    exportContainer.style.backgroundRepeat = "no-repeat"; // Prevent repeating
    exportContainer.style.backgroundAttachment = "fixed"; // Smooth even fill
    exportContainer.style.padding = "40px 40px";
    exportContainer.style.color = "#fff";
    exportContainer.style.fontFamily = "'Poppins', sans-serif";
    exportContainer.style.position = "fixed";
    exportContainer.style.inset = "0";
    exportContainer.style.display = "flex";
    exportContainer.style.flexDirection = "column";
    exportContainer.style.alignItems = "center";
    exportContainer.style.boxSizing = "border-box";
    exportContainer.style.overflow = "hidden";

    // Add a top mast with current date (export date) so it appears in the image
    const mast = document.createElement('div');
    mast.id = 'exportDate';
    mast.style.width = '100%';
    mast.style.textAlign = 'center';
    mast.style.color = '#fff';
    mast.style.fontSize = '16px';
    mast.style.fontWeight = '600';
    mast.style.marginBottom = '18px';
    mast.textContent = new Date().toLocaleString();
    exportContainer.appendChild(mast);

    // Style clone for export fit and leave space for mast
    clone.style.maxWidth = `${Math.max(vw - 120, 360)}px`;
    clone.style.width = '100%';
    clone.style.margin = '0 auto';
    clone.style.background = 'transparent';
    clone.style.padding = '20px';
    clone.style.fontSize = '18px';
    clone.style.lineHeight = '1.5';
    clone.style.overflow = 'auto';

    // Place clone inside the export container below the mast
    exportContainer.appendChild(clone);
    document.body.appendChild(exportContainer);

    // Use device pixel ratio to create a crisp export while keeping reasonable limits
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
        try {
            const link = document.createElement('a');
            link.download = `meal-management-result-${new Date().toISOString().slice(0,10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } finally {
            document.body.removeChild(exportContainer);
        }
    }).catch(err => {
        document.body.removeChild(exportContainer);
        alert("Error exporting image: " + err);
    });
}

// connect export buttons when DOM ready
document.addEventListener("DOMContentLoaded", () => {
    const inline = document.getElementById("inlineExportBtn");
    if (inline) inline.addEventListener("click", exportResultImage);

    // also protect result date update in case of page load
    updateResultDate();
});