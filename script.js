/* =========================================================
   Hasnain Shahid — Portfolio scripts
   ========================================================= */
(() => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    /* ---------- Theme toggle ---------- */
    const root = document.documentElement;
    const metaTheme = $('meta[name="theme-color"]');
    const applyMeta = () => metaTheme && metaTheme.setAttribute('content', root.dataset.theme === 'light' ? '#f6f8fc' : '#0a0e17');
    applyMeta();
    $('#themeToggle').addEventListener('click', () => {
        const next = root.dataset.theme === 'light' ? 'dark' : 'light';
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) { }
        applyMeta();
    });

    /* ---------- Mobile menu ---------- */
    const nav = $('#nav');
    const menuBtn = $('#menuBtn');
    const navLinks = $('#navLinks');
    const setMenu = (open) => {
        navLinks.classList.toggle('open', open);
        nav.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!navLinks.classList.contains('open')); });
    $$('a', navLinks).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

    /* ---------- Nav: background on scroll, hide on scroll down ---------- */
    let lastY = window.scrollY;
    const onScroll = () => {
        const y = window.scrollY;
        nav.classList.toggle('scrolled', y > 20);
        if (!navLinks.classList.contains('open')) nav.classList.toggle('hidden', y > 300 && y > lastY);
        lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Active nav link ---------- */
    const sectionLinks = $$('.nav-links a[href^="#"]');
    const spy = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                sectionLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(s => spy.observe(s));

    /* ---------- Hero entrance ---------- */
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('loaded')));

    /* ---------- Scroll progress bar ---------- */
    const progress = $('#scrollProgress');
    const setProgress = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress && progress.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
    };
    window.addEventListener('scroll', setProgress, { passive: true });
    window.addEventListener('resize', setProgress);
    setProgress();

    /* ---------- Reveal on scroll ---------- */
    // stagger cards that sit in the same grid row
    $$('.services-grid, .projects-grid').forEach(grid => {
        $$('.reveal', grid).forEach((el, i) => el.style.setProperty('--d', (i % 3) * 0.12 + 's'));
    });
    $$('.tags').forEach(ul => $$('li', ul).forEach((li, i) => li.style.setProperty('--i', i)));
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('in');
                revealObs.unobserve(en.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    $$('.reveal').forEach(el => revealObs.observe(el));

    /* ---------- Card hover: cursor spotlight + 3D tilt ---------- */
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    $$('.fx-tilt').forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
            card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
            if (canHover && !reduceMotion && card.classList.contains('in')) {
                card.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
                card.style.setProperty('--ry', ((x - 0.5) * 10).toFixed(2) + 'deg');
                card.classList.add('tilting');
            }
        });
        card.addEventListener('pointerleave', () => card.classList.remove('tilting'));
    });

    /* ---------- Stats count-up ---------- */
    const countObs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            const target = parseFloat(el.dataset.count);
            const dec = parseInt(el.dataset.decimals || '0', 10);
            const suffix = el.dataset.suffix || '';
            const start = performance.now();
            const dur = 1200;
            const tick = (t) => {
                const p = Math.min(1, (t - start) / dur);
                const v = target * (1 - Math.pow(1 - p, 3));
                el.textContent = v.toFixed(dec) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            };
            if (!reduceMotion) requestAnimationFrame(tick);
            countObs.unobserve(el);
        });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(el => countObs.observe(el));

    /* ---------- Rotating role (typed) ---------- */
    const roles = [
        'Python Automation Developer',
        'Web Scraping Expert',
        'Bot Developer',
        'Desktop App Builder (PyQt)',
        'AI Workflow Automation'
    ];
    const typedEl = $('#typed');
    (async function typeRoles() {
        if (reduceMotion) return;
        let i = 0;
        await sleep(1800);
        while (true) {
            const word = roles[i];
            // delete
            for (let n = typedEl.textContent.length; n >= 0; n--) {
                typedEl.textContent = typedEl.textContent.slice(0, n);
                await sleep(28);
            }
            i = (i + 1) % roles.length;
            const next = roles[i];
            for (let n = 1; n <= next.length; n++) {
                typedEl.textContent = next.slice(0, n);
                await sleep(55);
            }
            await sleep(2200);
            void word;
        }
    })();

    /* ---------- Hero: code editor typing + terminal ---------- */
    // Each line = array of [className, text]
    const program = [
        [['k', 'from'], ['', ' seleniumbase '], ['k', 'import'], ['', ' SB']],
        [['k', 'import'], ['', ' csv']],
        [],
        [['c', '# log in once, keep the session alive']],
        [['k', 'with'], ['', ' SB(uc='], ['k', 'True'], ['', ') '], ['k', 'as'], ['', ' bot:']],
        [['', '    bot.'], ['f', 'open'], ['', '('], ['s', '"https://client-dashboard.com"'], ['', ')']],
        [['', '    bot.'], ['f', 'login'], ['', '(user, password)']],
        [['', '    rows = bot.'], ['f', 'scrape_table'], ['', '('], ['s', '"#orders"'], ['', ')']],
        [],
        [['', '    '], ['k', 'with'], ['', ' '], ['f', 'open'], ['', '('], ['s', '"orders.csv"'], ['', ', '], ['s', '"w"'], ['', ') '], ['k', 'as'], ['', ' f:']],
        [['', '        csv.'], ['f', 'writer'], ['', '(f).'], ['f', 'writerows'], ['', '(rows)']],
        [['', '    '], ['f', 'print'], ['', '('], ['s', 'f"✓ {len(rows)} rows saved"'], ['', ')']],
    ];

    const termScript = [
        ['dim', '$ python bot.py'],
        ['info', '[info] launching chrome…'],
        ['info', '[info] session restored · logged in'],
        ['', '[scrape] page 1/12 … 12/12'],
        ['ok', '✓ 1,248 rows saved → orders.csv'],
        ['ok', '✓ done in 38s · next run 09:00'],
    ];

    const codeEl = $('#codeTyping');
    const termEl = $('#terminal');
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    function renderCode(lineCount, partial) {
        // lineCount = complete lines; partial = {segIndex, charIndex} for the next line
        let html = '';
        for (let l = 0; l < program.length; l++) {
            if (l > lineCount) break;
            const ln = `<span class="ln">${l + 1}</span>`;
            let lineHtml = '';
            const segs = program[l];
            for (let s = 0; s < segs.length; s++) {
                const [cls, text] = segs[s];
                let t = text;
                if (l === lineCount && partial) {
                    if (s > partial.seg) break;
                    if (s === partial.seg) t = text.slice(0, partial.ch);
                }
                lineHtml += cls ? `<span class="${cls}">${esc(t)}</span>` : esc(t);
            }
            html += ln + lineHtml + (l < lineCount ? '\n' : '');
        }
        codeEl.innerHTML = html;
    }

    function renderFull() {
        renderCode(program.length - 1, null);
        termEl.innerHTML = termScript.map(([c, t]) => `<p class="${c}">${esc(t)}</p>`).join('');
    }

    async function runHero() {
        if (reduceMotion) { renderFull(); return; }
        while (true) {
            termEl.innerHTML = '';
            codeEl.innerHTML = '';
            for (let l = 0; l < program.length; l++) {
                const segs = program[l];
                if (segs.length === 0) { renderCode(l, { seg: 0, ch: 0 }); await sleep(120); continue; }
                for (let s = 0; s < segs.length; s++) {
                    const len = segs[s][1].length;
                    for (let c = 1; c <= len; c++) {
                        renderCode(l, { seg: s, ch: c });
                        await sleep(18 + Math.random() * 30);
                    }
                }
                await sleep(140);
            }
            await sleep(500);
            for (const [cls, text] of termScript) {
                const p = document.createElement('p');
                p.className = cls;
                termEl.appendChild(p);
                if (text.startsWith('$')) {
                    for (let c = 1; c <= text.length; c++) { p.textContent = text.slice(0, c); await sleep(45); }
                    await sleep(300);
                } else {
                    p.textContent = text;
                    await sleep(520);
                }
            }
            await sleep(5000);
        }
    }
    if (codeEl && termEl) runHero();

    /* ---------- Featured case study bars ---------- */
    const featured = $('.featured');
    if (featured) {
        new IntersectionObserver((entries, o) => {
            entries.forEach(en => { if (en.isIntersecting) { featured.classList.add('in'); o.disconnect(); } });
        }, { threshold: 0.3 }).observe(featured);
    }

    /* ---------- Reviews carousel ---------- */
    // All reviews are from Fiverr (fiverr.com/mhasnain715). `img` is optional:
    // without it a cartoon avatar is drawn.
    const REVIEWS = [
        { name: 'jaquimlambrusco', country: 'Portugal', stars: 5, when: '1 month ago', service: 'Desktop App', img: '',
          text: 'Excellent experience from start to finish! The software was custom-built to meet my specific needs and exceeded my expectations. He actively contributed valuable suggestions and improvements that helped refine my original idea, resulting in an even better final product than I had imagined. I would definitely work with him again without hesitation!' },
        { name: 'zakotaz', country: 'Pakistan', stars: 5, when: '3 months ago', service: 'Desktop App', img: 'assets/reviews/zakotaz.jpg',
          text: 'It was nice working with you. Outstanding quality of work!! Bot is working as expected. Thanks a lot.' },
        { name: 'procomi', country: 'Nigeria', stars: 5, when: '4 months ago', service: 'Ticket Monitor Bot', img: 'assets/reviews/procomi.jpg',
          text: 'Good work and met the expectation.' },
        { name: 'th6eo0', country: 'Italy', stars: 5, when: '6 months ago', service: 'Sofascore Scraper', img: '',
          text: 'Excellent service, excellent understanding of requests, and well-structured code. Quick responses to any requests for changes and full availability to resolve issues. Recommended.' },
        { name: 'ivanablinks', country: 'Nigeria', stars: 5, when: '7 months ago', service: 'Desktop App', img: 'assets/reviews/ivanablinks.jpg',
          text: 'He delivered a great job, it was really nice to work with him. Thank you.' },
        { name: 'mathisnoble', country: 'United States', stars: 5, when: '8 months ago', service: 'Desktop App', img: 'assets/reviews/mathisnoble.jpg',
          text: 'Exceeded expectations — documentation, politeness, and proactive communication. Best developer.' },
        { name: 'mathisnoble', country: 'United States', stars: 5, when: '8 months ago', service: 'Desktop App', img: 'assets/reviews/mathisnoble.jpg',
          text: 'Exceeded expectations — documentation, deep understanding, and politeness. Highly recommended.' },
        { name: 'mathisnoble', country: 'United States', stars: 5, when: '8 months ago', service: 'Desktop App', img: 'assets/reviews/mathisnoble.jpg',
          text: 'Best of all. Nice job!' },
        { name: 'nabilautomated', country: 'Pakistan', stars: 5, when: '1 year ago', service: 'Desktop App', img: 'assets/reviews/nabilautomated.jpg',
          text: 'Thank you!' },
        { name: 'ahmeddutchie891', country: 'Netherlands', stars: 5, when: '1 year ago', service: 'Desktop App', img: '',
          text: 'It’s very nice to work with him.' },
        { name: 'mudarsiru', country: 'Nigeria', stars: 5, when: '1 year ago', service: 'Desktop App', img: 'assets/reviews/mudarsiru.jpg',
          text: 'Great work.' },
        { name: 'jayproductmatin', country: 'Nigeria', stars: 5, when: '1 year ago', service: 'Desktop App', img: 'assets/reviews/jayproductmatin.jpg',
          text: 'It’s a pleasure.' },
        { name: 'teammilele', country: 'Nigeria', stars: 4, when: '1 year ago', service: 'Desktop App', img: 'assets/reviews/teammilele.jpg',
          text: 'Nice working with him.' },
    ];

    // Simple cartoon avatar (SVG) seeded by the username
    function cartoonAvatar(seed) {
        let h = 0;
        for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        const pick = (arr, k) => arr[(h >>> k) % arr.length];
        const bg = pick(['#22d3ee', '#a78bfa', '#f472b6', '#facc15', '#4ade80', '#fb923c', '#60a5fa'], 0);
        const skin = pick(['#f8d0b0', '#e8b48f', '#c98e64', '#8d5a3b', '#f1c27d'], 3);
        const hair = pick(['#1f2937', '#4b2e1e', '#7c4a24', '#111827', '#9a6b3f', '#e5e7eb'], 6);
        const style = (h >>> 9) % 3;
        const hairPath = [
            'M14 30c0-12 8-19 18-19s18 7 18 19c-4-6-10-9-18-9s-14 3-18 9z',
            'M13 33c-1-14 7-22 19-22s21 8 19 22c-2-5-6-8-9-9-3 4-10 6-18 4-5 1-9 3-11 5z',
            'M16 26c2-9 9-14 16-14s14 5 16 14c-6-2-11-6-16-6s-10 4-16 6z'
        ][style];
        const glasses = (h >>> 12) % 4 === 0
            ? '<g fill="none" stroke="#0f172a" stroke-width="1.6"><circle cx="26" cy="35" r="4.2"/><circle cx="38" cy="35" r="4.2"/><path d="M30.2 35h3.6"/></g>' : '';
        return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="64" height="64" fill="${bg}"/>
            <path d="M12 64c2-11 10-16 20-16s18 5 20 16z" fill="#0f172a" opacity=".85"/>
            <circle cx="32" cy="34" r="15" fill="${skin}"/>
            <path d="${hairPath}" fill="${hair}"/>
            <circle cx="26" cy="35" r="1.8" fill="#0f172a"/><circle cx="38" cy="35" r="1.8" fill="#0f172a"/>
            <circle cx="22.5" cy="40" r="2.2" fill="#f87171" opacity=".35"/><circle cx="41.5" cy="40" r="2.2" fill="#f87171" opacity=".35"/>
            <path d="M27 41.5c2.8 3 7.2 3 10 0" stroke="#0f172a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
            ${glasses}
        </svg>`;
    }

    const track = $('#reviewsTrack');
    const carousel = $('#reviewsCarousel');
    if (track && carousel) {
        const N = REVIEWS.length;
        const dotsEl = $('#reviewsDots');
        const bar = $('.car-progress', carousel);
        const viewport = $('.car-viewport', carousel);
        const DUR = 4500;
        const GAP = 24;

        const starHtml = (n) => '★'.repeat(n) + `<span class="off">${'★'.repeat(5 - n)}</span>`;
        const cardHtml = (r, i) => `
            <article class="rcard" data-i="${i}" aria-roledescription="slide" aria-label="Review ${(i % N) + 1} of ${N}">
                <span class="quote-mark" aria-hidden="true">“</span>
                <div class="rcard-head">
                    <div class="rcard-avatar">${r.img
                        ? `<img src="${r.img}" alt="${esc(r.name)}" onerror="this.replaceWith(document.createRange().createContextualFragment(window.__avatar('${esc(r.name)}')))">`
                        : cartoonAvatar(r.name)}</div>
                    <div class="rcard-who"><b>${esc(r.name)}</b><small>${esc(r.country)} · ${esc(r.when)}</small></div>
                </div>
                <div class="stars" aria-label="${r.stars} out of 5 stars">${starHtml(r.stars)}</div>
                <blockquote>“${esc(r.text)}”</blockquote>
                <div class="rcard-meta"><span>${esc(r.service)}</span><span>fiverr</span></div>
            </article>`;
        window.__avatar = cartoonAvatar;

        // 3 copies → seamless infinite loop
        const all = [...REVIEWS, ...REVIEWS, ...REVIEWS];
        track.innerHTML = all.map(cardHtml).join('');
        const cards = $$('.rcard', track);
        dotsEl.innerHTML = REVIEWS.map((_, i) => `<button role="tab" aria-label="Show review ${i + 1}"></button>`).join('');
        const dots = $$('button', dotsEl);

        let idx = N;
        let cw = 420;
        let timer = null;
        let paused = false;
        let inView = false;

        const measure = () => {
            cw = Math.min(440, Math.round(viewport.clientWidth * (innerWidth < 640 ? 0.9 : 0.42)));
            cw = Math.max(cw, 260);
            track.style.setProperty('--cw', cw + 'px');
            cards.forEach(c => c.style.setProperty('--cw', cw + 'px'));
        };
        const place = (animate) => {
            track.classList.toggle('anim', animate);
            const x = viewport.clientWidth / 2 - (idx * (cw + GAP) + cw / 2);
            track.style.transform = `translateX(${x}px)`;
            cards.forEach((c, i) => {
                c.classList.toggle('active', i === idx);
                c.classList.toggle('near', Math.abs(i - idx) === 1);
                c.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
            });
            dots.forEach((d, i) => { d.classList.toggle('on', i === idx % N); d.setAttribute('aria-selected', String(i === idx % N)); });
        };
        const restartBar = () => {
            bar.classList.remove('run');
            void bar.offsetWidth;
            if (!paused && inView) { bar.style.setProperty('--dur', DUR + 'ms'); bar.classList.add('run'); }
        };
        const schedule = () => {
            clearTimeout(timer);
            restartBar();
            if (!paused && inView && !reduceMotion) timer = setTimeout(() => go(idx + 1), DUR);
        };
        const go = (to) => {
            idx = to;
            place(!reduceMotion);
            schedule();
        };
        track.addEventListener('transitionend', (e) => {
            if (e.target !== track) return;
            if (idx >= 2 * N || idx < N) {
                idx = ((idx - N) % N + N) % N + N;
                place(false);
            }
        });

        $('.car-btn.next', carousel).addEventListener('click', () => go(idx + 1));
        $('.car-btn.prev', carousel).addEventListener('click', () => go(idx - 1));
        dots.forEach((d, i) => d.addEventListener('click', () => go(N + i)));
        cards.forEach((c, i) => c.addEventListener('click', () => { if (i !== idx) go(i); }));

        // pause on hover / focus
        const pause = (p) => { paused = p; schedule(); };
        carousel.addEventListener('mouseenter', () => pause(true));
        carousel.addEventListener('mouseleave', () => pause(false));
        carousel.addEventListener('focusin', () => pause(true));
        carousel.addEventListener('focusout', () => pause(false));
        document.addEventListener('visibilitychange', () => pause(document.hidden));

        // swipe
        let sx = null;
        viewport.addEventListener('pointerdown', (e) => { sx = e.clientX; });
        viewport.addEventListener('pointerup', (e) => {
            if (sx === null) return;
            const dx = e.clientX - sx; sx = null;
            if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        });
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') go(idx + 1);
            if (e.key === 'ArrowLeft') go(idx - 1);
        });

        // only autoplay while visible
        new IntersectionObserver(([en]) => { inView = en.isIntersecting; schedule(); }, { threshold: 0.3 }).observe(carousel);

        measure();
        place(false);
        window.addEventListener('resize', () => { measure(); place(false); });
    }

    /* ---------- Footer year ---------- */
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
})();
