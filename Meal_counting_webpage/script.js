// ------------- Step navigation & utility -------------
function goToStep(step) {
  document
    .querySelectorAll(".form-step")
    .forEach((s) => s.classList.remove("active"));
  const el = document.getElementById("step" + step);
  if (el) el.classList.add("active");

  // focus first input
  const first = document.querySelector("#step" + step + " input");
  if (first) first.focus();
}

function goBack(step) {
  if (step >= 0) goToStep(step);
}

function clearInputs() {
  document.querySelectorAll(".container input").forEach((i) => (i.value = ""));
}

// ------------- Enter navigation (robust) -------------
document.addEventListener("keydown", function (e) {
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
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("focus", () => {
    setTimeout(
      () => input.scrollIntoView({ behavior: "smooth", block: "center" }),
      300
    );
  });
});

// ------------- Date in result (top-right) -------------
function formatDateForUI(d = new Date()) {
  const opts = { year: "numeric", month: "short", day: "numeric" };
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
    parseInt(document.getElementById("shuvoMeals").value) || 0,
  ];
  const bazars = [
    parseInt(document.getElementById("ashikBazar").value) || 0,
    parseInt(document.getElementById("gaziBazar").value) || 0,
    parseInt(document.getElementById("ibrahimBazar").value) || 0,
    parseInt(document.getElementById("shuvoBazar").value) || 0,
  ];

  const totalMeals = meals.reduce((a, b) => a + b, 0);
  const totalBazar = bazars.reduce((a, b) => a + b, 0);
  const mealRate = totalMeals > 0 ? totalBazar / totalMeals : 0;

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
    const balanceText =
      balance > 0
        ? `<span class="positive">+${balance.toFixed(2)}</span>`
        : `<span class="negative">${balance.toFixed(2)}</span>`;
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
  goToStep(3);
}

// ----------------- Export (simplified) -----------------
function exportResultImage() {
  const result = document.getElementById("result");

  if (!result || result.innerHTML.trim() === "") {
    alert("No result to export. Please calculate first.");
    return;
  }

  // Clone the result element
  const clone = result.cloneNode(true);

  const headerCells = clone.querySelectorAll("thead th");
  headerCells.forEach((th) => {
    // Ensure text color on headers matches (override if needed)
    th.style.background = "#fff";
    th.style.color = "#0d5546";
    th.style.fontWeight = "700";
  });

  // Create export container offscreen
  const exportContainer = document.createElement("div");
  exportContainer.style.position = "fixed";
  exportContainer.style.top = "-9999px";
  exportContainer.style.left = "-9999px";
  exportContainer.style.padding = "40px";
  exportContainer.style.zIndex = "-1";
  exportContainer.style.background =
    "linear-gradient(135deg, #0d5546, #162e7a, #541f7a)";
  exportContainer.style.backgroundSize = "100% 100%";
  exportContainer.style.backgroundRepeat = "no-repeat";
  exportContainer.style.backgroundAttachment = "fixed";
  exportContainer.style.boxSizing = "border-box";
  exportContainer.style.color = "#fff";
  exportContainer.style.maxWidth = "800px";
  exportContainer.style.borderRadius = "8px";

  // Create date element
  const dateEl = document.createElement("div");
  dateEl.textContent = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  dateEl.style.textAlign = "center";
  dateEl.style.fontWeight = "600";
  dateEl.style.marginBottom = "20px";
  dateEl.style.fontSize = "16px";
  dateEl.style.color = "#fff";

  // Style the cloned result
  clone.style.background = "transparent";
  clone.style.padding = getComputedStyle(result).padding;
  clone.style.color = "#fff";

  // Append date and cloned result inside export container
  exportContainer.appendChild(dateEl);
  exportContainer.appendChild(clone);

  document.body.appendChild(exportContainer);

  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3));

  html2canvas(exportContainer, {
    scale: dpr,
    backgroundColor: null,
    useCORS: true,
  })
    .then((canvas) => {
      document.body.removeChild(exportContainer);

      const link = document.createElement("a");
      link.download = `meal-management-result-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    })
    .catch((err) => {
      document.body.removeChild(exportContainer);
      alert("Error exporting image: " + err);
    });
}


// connect export button when DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const inline = document.getElementById("inlineExportBtn");
  if (inline) inline.addEventListener("click", exportResultImage);

  updateResultDate();
});
