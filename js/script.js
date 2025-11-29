// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Marquee Clone (Infinite Scroll)
const marqueeContent = document.querySelector('.marquee-track');
if (marqueeContent) {
    const clone = marqueeContent.innerHTML;
    marqueeContent.innerHTML += clone;
}

// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Elements to animate
const animatedElements = document.querySelectorAll('.service-card, .hero-title, .section-heading, .section-text, .gallery-item, .contact-container');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)';
    observer.observe(el);
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.textContent;

        btn.textContent = 'TRANSMITTING...';
        btn.style.background = '#00f0ff';

        setTimeout(() => {
            btn.textContent = 'SEQUENCE COMPLETE';
            btn.style.background = '#00ff00';
            contactForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
        }, 1500);
    });
}
