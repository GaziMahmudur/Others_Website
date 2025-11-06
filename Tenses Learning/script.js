const levels = [
    { question: "How many types of tenses are there?", answer: "3" },
    { question: "What are the names of the 3 tenses?", answer: "Present, Past, Future" },
    { question: "How many parts does each tense have?", answer: "4" },
    { question: "What are the names of the 4 aspects?", answer: "Indefinite, Continuous, Perfect, Perfect Continuous" },
    { question: "Practice Level", practice: true }
];

let currentLevel = parseInt(localStorage.getItem('tensesLevel')) || 0;
let attempts = 0;

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const messageEl = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const restartBtn = document.getElementById('restartBtn');
const prevLevelBtn = document.getElementById('prevLevelBtn');
const levelDisplay = document.getElementById('levelDisplay');

const practiceBox = document.getElementById('practiceBox');
const practiceQuestion = document.getElementById('practiceQuestion');
const structureInput = document.getElementById('structureInput');
const examplePrompt = document.getElementById('examplePrompt');
const exampleInput = document.getElementById('exampleInput');
const practiceSubmit = document.getElementById('practiceSubmit');
const practiceMessage = document.getElementById('practiceMessage');

function showQuestion() {
    const level = levels[currentLevel];
    levelDisplay.textContent = `Level: ${currentLevel + 1}`;
    answerEl.value = "";
    messageEl.textContent = "";

    if (level.practice) {
        // Hide normal input
        answerEl.style.display = "none";
        submitBtn.style.display = "none";
        questionEl.textContent = "Practice Level: Provide the structure and an example for a random tense.";

        // Practice visible
        practiceBox.style.display = "block";

        const randomQuestions = [
            "Present Indefinite Structure?",
            "Present Continuous Structure?",
            "Present Perfect Structure?",
            "Present Perfect Continuous Structure?",
            "Past Indefinite Structure?",
            "Past Continuous Structure?",
            "Past Perfect Structure?",
            "Past Perfect Continuous Structure?",
            "Future Indefinite Structure?",
            "Future Continuous Structure?",
            "Future Perfect Structure?",
            "Future Perfect Continuous Structure?"
        ];
        const randomQ = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];

        practiceQuestion.textContent = randomQ;
        examplePrompt.textContent = "Give an example according to the above structure.";
        structureInput.value = "";
        exampleInput.value = "";
        practiceMessage.textContent = "";
    } else {
        // Show normal level question
        answerEl.style.display = "inline-block";
        submitBtn.style.display = "inline-block";
        practiceBox.style.display = "none";

        questionEl.textContent = level.question;
    }
}

showQuestion();

function checkAnswer() {
    const userAnswer = answerEl.value.trim();
    const level = levels[currentLevel];

    if (userAnswer.toLowerCase() === (level.answer || '').toLowerCase()) {
        messageEl.textContent = "✅ Correct!";
        messageEl.classList.add('correct');
        setTimeout(nextLevel, 1000);
    } else {
        attempts++;
        if (attempts < 3) {
            messageEl.textContent = `❌ Wrong! Attempts left: ${3 - attempts}`;
            messageEl.classList.remove('correct');
        } else {
            messageEl.textContent = `⚠️ Correct answer: ${level.answer}`;
            messageEl.classList.add('correct');
            setTimeout(() => {
                messageEl.textContent = "Now try again!";
                messageEl.classList.remove('correct');
                attempts = 0;
                answerEl.value = "";
            }, 15000);
        }
    }
}

submitBtn.addEventListener('click', checkAnswer);
answerEl.addEventListener('keyup', e => { if (e.key === 'Enter') checkAnswer(); });

// ✅ Practice level logic
practiceSubmit.addEventListener('click', () => {
    const structure = structureInput.value.trim();
    const example = exampleInput.value.trim();

    if (!structure) {
        practiceMessage.textContent = "❌ Please write the structure!";
        practiceMessage.classList.remove('correct');
        return;
    }
    if (!example) {
        practiceMessage.textContent = "❌ Please write an example!";
        practiceMessage.classList.remove('correct');
        return;
    }

    practiceMessage.textContent = "✅ Good! Both answers submitted!";
    practiceMessage.classList.add('correct');
    setTimeout(nextLevel, 1500);
});

function nextLevel() {
    currentLevel++;
    attempts = 0;
    if (currentLevel >= levels.length) currentLevel = levels.length - 1;
    localStorage.setItem('tensesLevel', currentLevel);
    showQuestion();
}

restartBtn.addEventListener('click', () => {
    currentLevel = 0;
    localStorage.setItem('tensesLevel', currentLevel);
    attempts = 0;
    showQuestion();
});

prevLevelBtn.addEventListener('click', () => {
    if (currentLevel > 0) currentLevel--;
    localStorage.setItem('tensesLevel', currentLevel);
    attempts = 0;
    showQuestion();
});
