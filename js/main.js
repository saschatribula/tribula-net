/* ============================================
   Tribula Consulting – main.js
   ============================================ */

// ── Mobile menu ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');
const header    = document.getElementById('header');

hamburger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// ── Sticky header ────────────────────────────
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Scroll-reveal ────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── FAQ accordion ────────────────────────────
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item   = button.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// ── Hero Lottie scroll animation ─────────────
(function () {
    const items = document.querySelectorAll('.lottie-item');
    if (!items.length) return;

    // Each item flies in its own direction when scrolling out
    const dirs = [
        { x: 260, y: -170 },   // analyse  → top-right
        { x: 320, y:   10 },   // UX       → right
        { x: 260, y:  170 },   // seo      → bottom-right
    ];

    let ticking = false;

    function update() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        // Reset and bail on narrow screens
        if (window.innerWidth < 1280) {
            items.forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
            return;
        }

        // progress: 0 (hero fully visible) → 1 (hero scrolled away)
        const p = Math.min(Math.max(window.scrollY / (hero.offsetHeight * 0.55), 0), 1);

        items.forEach((el, i) => {
            const d = dirs[i] ?? dirs[0];
            el.style.transform = `translate(${d.x * p}px, ${d.y * p}px)`;
            el.style.opacity   = String(1 - p);
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });

    window.addEventListener('resize', update, { passive: true });
    update(); // run once on load
})();

// ── Active nav link ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

window.addEventListener('scroll', () => {
    const pos = window.scrollY + 120;
    sections.forEach(section => {
        if (pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + section.id);
            });
        }
    });
}, { passive: true });

// ── Forminit contact form ────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const forminit = new Forminit();
    const submitBtn  = document.getElementById('form-submit');
    const feedback   = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic HTML5 validation pass-through
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        submitBtn.textContent = 'Wird gesendet …';
        submitBtn.disabled = true;
        feedback.className = 'form-feedback';
        feedback.textContent = '';

        const { error } = await forminit.submit('ps8gpjty2rf', new FormData(contactForm));

        if (error) {
            feedback.className = 'form-feedback form-feedback--error';
            feedback.textContent = 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@tribula.net.';
            submitBtn.textContent = 'Anfrage absenden →';
            submitBtn.disabled = false;
            return;
        }

        // Success – replace form content
        contactForm.innerHTML = `
            <div class="form-success">
                <div class="form-success__icon">✓</div>
                <h3>Vielen Dank!</h3>
                <p>Ihre Anfrage wurde erfolgreich übermittelt. Ich melde mich in der Regel innerhalb von 24 Stunden bei Ihnen.</p>
            </div>`;
    });
}
