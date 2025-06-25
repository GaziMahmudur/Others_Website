const cards = document.querySelectorAll('.friend-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible'); // retrigger animation
        }
    });
}, {
    threshold: 0.15
});

cards.forEach(card => observer.observe(card));

// ScrollReveal for additional smooth reveal (optional)
ScrollReveal({
    distance: '60px',
    duration: 2000,
    delay: 200,
    reset: true
}).reveal('.friend-card', {
    origin: 'bottom',
    interval: 100
});
