
/* ------------------ Data & Levels ------------------ */
const levels = [
    { // Level 1
        question: "How many types of tenses are there?",
        answer: "3",
        example: "There are 3 types of tenses: Present, Past, Future."
    },
    { // Level 2
        question: "What are the three types of tenses?",
        answer: "Present, Past, Future",
        example: "Present, Past, Future."
    },
    { // Level 3
        question: "How many parts does each tense have?",
        answer: "4",
        example: "Each tense has 4 parts: Indefinite, Continuous, Perfect, Perfect Continuous."
    },
    { // Level 4
        question: "Name the parts of Present Tense.",
        answer: "Present Indefinite, Present Continuous, Present Perfect, Present Perfect Continuous",
        example: "Present Indefinite: I eat. Present Continuous: I am eating..."
    },
    { // Level 5 - Random Practice
        question: "Practice - fill in a tense structure (Randomly)",
        practice: true
    }
];

/* ------------------ Initialization ------------------ */
let currentLevel = parseInt(localStorage.getItem('tensesLevel')) || 0;
let attempts = 0;
let showAnswerFlag = false; // Tracks if we just showed correct answer

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const messageEl = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const exampleBox = document.getElementById('exampleBox');
const restartBtn = document.getElementById('restartBtn');
const prevLevelBtn = document.getElementById('prevLevelBtn');

function showQuestion() {
    messageEl.textContent = "";
    answerEl.value = "";
    const level = levels[currentLevel];
    if (level.practice) {
        questionEl.textContent = "Random Practice: Structure + Example (Type your answer)";
        exampleBox.textContent = "Example: Present Indefinite - I eat. Enter your own sentence below.";
    } else {
        questionEl.textContent = level.question;
        exampleBox.textContent = level.example || "";
    }
}

showQuestion();

/* ------------------ Event Listeners ------------------ */
submitBtn.addEventListener('click', () => {
    const userAnswer = answerEl.value.trim();
    const level = levels[currentLevel];

    if (level.practice) {
        if (userAnswer.length > 3) {
            messageEl.textContent = "✅ Good! Keep practicing!";
            messageEl.classList.add('correct');
            setTimeout(nextLevel, 1000);
        } else {
            messageEl.textContent = "❌ Try again!";
            messageEl.classList.remove('correct');
        }
        return;
    }

    if (userAnswer.toLowerCase() === level.answer.toLowerCase()) {
        messageEl.textContent = "✅ Correct!";
        messageEl.classList.add('correct');
        setTimeout(nextLevel, 1000);
    } else {
        attempts++;
        if (attempts < 3) {
            messageEl.textContent = `❌ Wrong! Attempts left: ${3 - attempts}`;
            messageEl.classList.remove('correct');
        } else {
            // Show correct answer and set flag to re-ask
            messageEl.textContent = `⚠️ Correct answer: ${level.answer}`;
            messageEl.classList.add('correct');
            showAnswerFlag = true;


            setTimeout(() => {
                messageEl.textContent = "Now try again!";
                messageEl.classList.remove('correct');
                attempts = 0; // reset attempts
                answerEl.value = "";
            }, 2000);
        }
    }
});

/* ------------------ Restart & Previous ------------------ */
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

/* ------------------ Next Level ------------------ */
function nextLevel() {
    currentLevel++;
    attempts = 0;
    if (currentLevel >= levels.length) currentLevel = levels.length - 1;
    localStorage.setItem('tensesLevel', currentLevel);
    showQuestion();
}

/* ------------------ Background Particles (random, moving, blurred) ------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const bg = document.getElementById('bg');
    if (!bg) return; // safety

    const PARTICLE_COUNT = 28; // change to taste (20-40 looks nice)

    // Tuning: change these to control speed and opacity
    // SPEED_MULTIPLIER: higher => faster motion (1.0 = normal)
    const SPEED_MULTIPLIER = 3.0;
    // base radial color alpha (keep small for subtle look)
    const COLOR_OPACITY_MIN = 0.50;
    const COLOR_OPACITY_MAX = 0.22;
    // pulsing opacity range
    const PULSE_OPACITY_MIN = 0.12;
    const PULSE_OPACITY_MAX = 0.6;

    const rand = (min, max) => Math.random() * (max - min) + min;

    function makeColor() {
        // soft pastel-ish colors with low alpha
        const hues = [160, 190, 220, 260, 290];
        const h = hues[Math.floor(Math.random() * hues.length)];
        const s = Math.floor(rand(50, 80));
        const l = Math.floor(rand(45, 70));
        const a = rand(COLOR_OPACITY_MIN, COLOR_OPACITY_MAX).toFixed(2);
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }

    function createParticle() {
        const el = document.createElement('div');
        el.className = 'particle';
        const size = Math.round(rand(60, 260));
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.left = rand(0, 100) + '%';
        el.style.top = rand(0, 100) + '%';
        el.style.background = `radial-gradient(circle at 30% 30%, ${makeColor()}, transparent 60%)`;
        bg.appendChild(el);
        animateParticle(el);
    }

    function animateParticle(el) {
        // base duration scaled by SPEED_MULTIPLIER (divide to make >1 faster)
        const dur = Math.round(rand(12000, 42000) / SPEED_MULTIPLIER);
        const dx = rand(-12, 12); // vw
        const dy = rand(-8, 8); // vh
        const scale1 = rand(0.7, 1.4);
        const scale2 = rand(0.7, 1.4);

        const keyframes = [
            { transform: `translate3d(0,0,0) scale(${scale1})` },
            { transform: `translate3d(${dx}vw, ${dy}vh, 0) scale(${scale2})` }
        ];

        el.animate(keyframes, {
            duration: dur,
            direction: 'alternate',
            iterations: Infinity,
            easing: 'ease-in-out'
        });

        // gentle opacity pulsing using the tunable ranges
        const p1 = rand(PULSE_OPACITY_MIN, PULSE_OPACITY_MAX);
        const p2 = rand(PULSE_OPACITY_MIN, PULSE_OPACITY_MAX);
        el.animate([
            { opacity: p1 },
            { opacity: p2 }
        ], { duration: Math.round(dur * 0.9), iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

    // small mouse-based parallax for the whole background layer
    (function addParallax() {
        const strengthX = 6; // px
        const strengthY = 4; // px
        let raf = null;
        let last = { x: 0, y: 0 };
        window.addEventListener('mousemove', (e) => {
            last.x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
            last.y = (e.clientY / window.innerHeight - 0.5) * 2;
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                bg.style.transform = `translate(${last.x * strengthX}px, ${last.y * strengthY}px)`;
            });
        });
    })();

    // optional: regenerate on visibility change to save CPU when tab hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // pause animations by setting playbackRate to 0
            document.querySelectorAll('.particle').forEach(p => p.getAnimations().forEach(a => a.pause()));
        } else {
            document.querySelectorAll('.particle').forEach(p => p.getAnimations().forEach(a => a.play()));
        }
    });

    // small button ripple effect (no external libs)
    document.addEventListener('click', (ev) => {
        const target = ev.target;
        if (!(target instanceof HTMLElement)) return;
        const btn = target.closest('button');
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        btn.appendChild(ripple);
        // cleanup
        setTimeout(() => ripple.remove(), 800);
    });

    // message helper: auto-hide non-correct messages
    let _msgTimeout = null;
    function setMessage(text, opts = {}) {
        // opts: { isCorrect: boolean, sticky: boolean }
        clearTimeout(_msgTimeout);
        if (!text) {
            messageEl.textContent = '';
            messageEl.classList.remove('correct');
            messageEl.classList.add('hidden');
            return;
        }
        messageEl.classList.remove('hidden');
        messageEl.textContent = text;
        if (opts.isCorrect) messageEl.classList.add('correct'); else messageEl.classList.remove('correct');
        if (opts.sticky) return;
        _msgTimeout = setTimeout(() => {
            if (!messageEl.classList.contains('correct')) {
                messageEl.classList.add('hidden');
            }
        }, 3200);
    }

    // replace some direct message writes above to use setMessage
    // (small patch: override existing submit handler to call setMessage inside it)
    submitBtn.removeEventListener && submitBtn.removeEventListener('click', null);
    submitBtn.addEventListener('click', () => {
        const userAnswer = answerEl.value.trim();
        const level = levels[currentLevel];

        if (level.practice) {
            if (userAnswer.length > 3) {
                setMessage('✅ Good! Keep practicing!', { isCorrect: true });
                setTimeout(nextLevel, 1000);
            } else {
                setMessage('❌ Try again!');
            }
            return;
        }

        if (userAnswer.toLowerCase() === (level.answer || '').toLowerCase()) {
            setMessage('✅ Correct!', { isCorrect: true });
            setTimeout(nextLevel, 1000);
        } else {
            attempts++;
            if (attempts < 3) {
                setMessage(`❌ Wrong! Attempts left: ${3 - attempts}`);
            } else {
                setMessage(`⚠️ Correct answer: ${level.answer}`, { isCorrect: true, sticky: true });
                showAnswerFlag = true;

                setTimeout(() => {
                    setMessage('Now try again!');
                    attempts = 0; // reset attempts
                    answerEl.value = '';
                }, 2000);
            }
        }
    });
});
