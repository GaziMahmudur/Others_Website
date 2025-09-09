function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById("step" + step).classList.add('active');

    // Auto focus first input
    let firstInput = document.querySelector("#step" + step + " input");
    if (firstInput) firstInput.focus();
}

function goBack(step) {
    if (step >= 0) goToStep(step);
}

function clearInputs() {
    document.querySelectorAll("input").forEach(input => input.value = "");
}

// Enter key navigation
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        let activeStep = document.querySelector(".form-step.active");
        let inputs = activeStep.querySelectorAll("input");
        let currentIndex = Array.from(inputs).indexOf(document.activeElement);

        if (currentIndex > -1) {
            e.preventDefault();
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
            } else {
                // Last input in step
                let nextBtn = activeStep.querySelector("button.next-btn, button.finish-btn");
                if (nextBtn) nextBtn.click();
            }
        }
    }
});

// Mobile keyboard scroll
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", () => {
        setTimeout(() => input.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
    });
});

// Calculate Result
function calculate() {
    const names = ["Ashik", "Gazi", "Ibrahim", "Shuvo"];
    let meals = [
        parseInt(document.getElementById("ashikMeals").value) || 0,
        parseInt(document.getElementById("gaziMeals").value) || 0,
        parseInt(document.getElementById("ibrahimMeals").value) || 0,
        parseInt(document.getElementById("shuvoMeals").value) || 0
    ];
    let bazars = [
        parseInt(document.getElementById("ashikBazar").value) || 0,
        parseInt(document.getElementById("gaziBazar").value) || 0,
        parseInt(document.getElementById("ibrahimBazar").value) || 0,
        parseInt(document.getElementById("shuvoBazar").value) || 0
    ];

    let totalMeals = meals.reduce((a, b) => a + b, 0);
    let totalBazar = bazars.reduce((a, b) => a + b, 0);
    let mealRate = totalMeals > 0 ? (totalBazar / totalMeals) : 0;

    let html = `<p><b>Total Meals:</b> ${totalMeals}<br>
              <b>Total Bazar:</b> ${totalBazar} Tk<br>
              <b>Meal Rate:</b> ${mealRate.toFixed(2)} Tk</p>`;

    html += `<table>
    <tr><th>Name</th><th>Meals</th><th>Bazar</th><th>Meal Cost</th><th>Balance</th></tr>`;

    names.forEach((name, i) => {
        let mealCost = meals[i] * mealRate;
        let balance = mealCost - bazars[i];
        let balanceText = balance > 0
            ? `<span class="positive">+${balance.toFixed(2)} (Will give)</span>`
            : `<span class="negative">${balance.toFixed(2)} (Will get)</span>`;

        html += `<tr>
      <td>${name}</td>
      <td>${meals[i]}</td>
      <td>${bazars[i]}</td>
      <td>${mealCost.toFixed(2)}</td>
      <td>${balanceText}</td>
    </tr>`;
    });

    html += `</table>`;
    document.getElementById("result").innerHTML = html;
    goToStep(3);
}
