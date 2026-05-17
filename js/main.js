/* ============================================
   Tribula Consulting – main.js
   ============================================ */

// ── Header-dependent code (runs after partials inject header) ────
document.addEventListener('partials-ready', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');
    const header    = document.getElementById('header');
    if (!hamburger || !navMenu || !header) return;

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

    // Sticky header
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Active nav link highlight
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
});

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

    const dirs = [
        { x: 260, y: -170 },
        { x: 320, y:   10 },
        { x: 260, y:  170 },
    ];

    let ticking = false;

    function update() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        if (window.innerWidth < 1280) {
            items.forEach(el => { el.style.transform = ''; el.style.opacity = ''; });
            return;
        }

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
    update();
})();

// ── Next-section floating button (mobile) ────
(function () {
    const btn = document.getElementById('next-section-btn');
    if (!btn) return;

    const ids      = ['hero','probleme','leistungen','prozess','ueber-uns','referenzen','preise','launch-schutz','projekte','faq','kontakt'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

    function currentIndex() {
        const mid = window.scrollY + window.innerHeight * 0.5;
        let idx = 0;
        sections.forEach((s, i) => { if (s.offsetTop <= mid) idx = i; });
        return idx;
    }

    function update() {
        const idx  = currentIndex();
        const show = idx > 0 && idx < sections.length - 1;
        btn.classList.toggle('visible', show);
        if (show) btn.dataset.target = sections[idx + 1].id;
    }

    btn.addEventListener('click', () => {
        const next = document.getElementById(btn.dataset.target);
        if (next) next.scrollIntoView({ behavior: 'smooth' });
    });

    window.addEventListener('scroll', update, { passive: true });
    update();
})();

// ── Pricing tab toggle ───────────────────────
(function () {
    const tabs   = document.querySelectorAll('.pricing-tab');
    const panels = document.querySelectorAll('.pricing-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            panels.forEach(panel => {
                const active = panel.id === 'tab-' + target;
                panel.classList.toggle('active', active);
                if (active) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });

            // re-observe fade-in cards in newly visible panel
            document.querySelectorAll('.pricing-panel.active .fade-in:not(.visible)')
                .forEach(el => observer.observe(el));
        });
    });
})();

// ── Bento SVG in-view animation (touch/mobile only) ──
(function () {
    const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice()) return;

    const svgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('svg-animated');
                svgObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.bento-card').forEach(el => svgObserver.observe(el));
})();

// ── Forminit contact form ────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const forminit  = new Forminit();
    const submitBtn = document.getElementById('form-submit');
    const feedback  = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

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

        contactForm.innerHTML = `
            <div class="form-success">
                <div class="form-success__icon">✓</div>
                <h3>Vielen Dank!</h3>
                <p>Ihre Anfrage wurde erfolgreich übermittelt. Ich melde mich in der Regel innerhalb von 24 Stunden bei Ihnen.</p>
            </div>`;
    });
}
