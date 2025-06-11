window.onload = () => {
    document.body.style.display = "flex"; // Show body after load
};

function submitName() {
    const input = document.getElementById("nameInput").value.trim();
    if (input) {
        document.getElementById("nameDisplay").textContent = input;
        document.getElementById("nameModal").style.display = "none";
    } else {
        alert("Name is required!");
    }
}

document.getElementById("nameInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        submitName();
    }
});

function flipCard(card) {
    card.classList.toggle("flipped");
}