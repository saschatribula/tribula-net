(async function () {
    const isIndex = location.pathname === '/' ||
                    location.pathname.endsWith('/') ||
                    location.pathname.endsWith('/index.html');

    async function loadPartial(id, file) {
        const el = document.getElementById(id);
        if (!el) return;
        try {
            const res = await fetch(file);
            if (res.ok) el.outerHTML = await res.text();
        } catch (e) { /* fetch unavailable (file://) – silently skip */ }
    }

    await Promise.all([
        loadPartial('site-header', 'partials/header.html'),
        loadPartial('site-footer', 'partials/footer.html'),
    ]);

    // On the index page rewrite index.html#section → #section for smooth scroll
    if (isIndex) {
        document.querySelectorAll('[href^="index.html#"]').forEach(a => {
            a.setAttribute('href', a.getAttribute('href').replace('index.html', ''));
        });
    }

    document.dispatchEvent(new CustomEvent('partials-ready'));
})();
