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
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn');
        const originalText = "SEND MESSAGE"; // Hardcoded to match new HTML

        // Loading State
        btn.classList.add('loading');

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (response.status === 200) {
                // Success
                btn.classList.remove('loading');
                btn.textContent = 'MESSAGE SENT';
                btn.style.background = '#00ff00';
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            } else {
                // Error from API
                console.log(response);
                btn.classList.remove('loading');
                btn.textContent = 'ERROR';
                btn.style.background = 'red';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            btn.classList.remove('loading');
            btn.textContent = 'ERROR';
            btn.style.background = 'red';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 3000);
        }
    });
}

// --- DOM Enhancements for Premium UI (Without touching HTML) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Enhance Services Section
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        // Add "Learn More" button if it doesn't exist
        if (!card.querySelector('.learn-more')) {
            const learnMoreBtn = document.createElement('a');
            learnMoreBtn.href = '#';
            learnMoreBtn.className = 'learn-more';
            learnMoreBtn.innerHTML = 'Learn More <span class="arrow">→</span>';
            card.appendChild(learnMoreBtn);
        }
    });

    // 2. Enhance Process Section (Vertical Timeline)
    const processSteps = document.querySelector('.process-steps');
    if (processSteps) {
        // Ensure the container has the relative positioning needed for the line
        processSteps.style.position = 'relative';

        const steps = processSteps.querySelectorAll('.step-item');
        steps.forEach(step => {
            // Wrap content (h3, p) in a div for layout
            const title = step.querySelector('h3');
            const desc = step.querySelector('p');

            // Check if already wrapped to avoid duplication
            if (title && desc && title.parentElement === step) {
                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'step-content';

                // Move elements into wrapper
                step.appendChild(contentWrapper);
                contentWrapper.appendChild(title);
                contentWrapper.appendChild(desc);
            }
        });
    }
});
