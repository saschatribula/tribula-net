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

// ── Contact form feedback ────────────────────
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        const btn = form.querySelector('[type="submit"]');
        btn.textContent = 'Wird gesendet …';
        btn.disabled = true;
        // Formspree handles the POST; re-enable if error occurs
        await new Promise(r => setTimeout(r, 3000));
        btn.textContent = 'Anfrage absenden →';
        btn.disabled = false;
    });
}
