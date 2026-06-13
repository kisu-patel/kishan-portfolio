/* =====================================================
   KISHAN S. PATEL — PORTFOLIO v2
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursor();
    initNavigation();
    initScrollReveal();
    initPortfolioFilter();
    initCounters();
    initContactForm();
    initBackToTop();
    initMagnetic();
    initMarquee();
});

/* ── PRELOADER ── */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 1600);
    });
}

/* ── CURSOR ── */
function initCursor() {
    const cursor   = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasHover) {
        cursor.style.display   = 'none';
        follower.style.display = 'none';
        return;
    }

    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function loop() {
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        cursor.style.left   = mx + 'px';
        cursor.style.top    = my + 'px';
        follower.style.left = fx + 'px';
        follower.style.top  = fy + 'px';
        requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .work-card, .filter-btn, .tool-badge, .cert-item').forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
}

/* ── NAVIGATION ── */
function initNavigation() {
    const header    = document.getElementById('header');
    const navMenu   = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose  = document.getElementById('nav-close');
    const navLinks  = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
        highlightNav();
    }, { passive: true });

    navToggle?.addEventListener('click', () => navMenu.classList.add('open'));
    navClose?.addEventListener('click',  () => navMenu.classList.remove('open'));
    navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('open')));

    function highlightNav() {
        const ids     = ['home', 'about', 'work', 'services', 'process', 'experience', 'contact'];
        const scrollY = window.scrollY + 120;
        let current   = '';

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrollY) current = id;
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === '#' + current);
        });
    }
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.section__head, .work-item, .about__layout, .about__stats, ' +
        '.exp__timeline, .exp__certs, .contact__left, .contact__right, ' +
        '.cert-item, .timeline-item, .stat, .work__platforms'
    );

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = ((i % 3) * 0.08) + 's';
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    targets.forEach(el => observer.observe(el));
}

/* ── PORTFOLIO FILTER ── */
function initPortfolioFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items   = document.querySelectorAll('.work-item');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            items.forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                item.style.display = match ? '' : 'none';
            });
        });
    });
}

/* ── STAT COUNTERS ── */
function initCounters() {
    const counters = document.querySelectorAll('.stat__num[data-count]');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el     = e.target;
            const target = parseInt(el.dataset.count, 10);
            const dur    = 1200;
            const start  = performance.now();

            const tick = now => {
                const t    = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.floor(ease * target);
                if (t < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            };

            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ── CONTACT FORM ── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();

        const required = form.querySelectorAll('[required]');
        let valid = true;

        required.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.style.borderColor = '#c0504a';
            } else {
                input.style.borderColor = '';
            }
        });

        if (!valid) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const btn  = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        btn.disabled  = true;

        setTimeout(() => {
            form.reset();
            btn.innerHTML = orig;
            btn.disabled  = false;
            showNotification('Message sent! I\'ll get back to you soon.', 'success');
        }, 2000);
    });
}

/* ── NOTIFICATION ── */
function showNotification(message, type) {
    document.querySelectorAll('.ksp-notif').forEach(n => n.remove());

    const el = document.createElement('div');
    el.className = 'ksp-notif';

    const isSuccess = type === 'success';
    Object.assign(el.style, {
        position:    'fixed',
        bottom:      '2rem',
        left:        '50%',
        transform:   'translateX(-50%) translateY(20px)',
        background:  isSuccess ? '#0f1f0f' : '#1f0f0f',
        border:      `1px solid ${isSuccess ? '#3a7a3a' : '#7a3a3a'}`,
        color:       isSuccess ? '#7dca7d' : '#ca7d7d',
        padding:     '0.9rem 1.5rem',
        borderRadius:'999px',
        display:     'flex',
        alignItems:  'center',
        gap:         '0.75rem',
        zIndex:      '9999',
        fontSize:    '0.875rem',
        fontWeight:  '500',
        fontFamily:  'var(--font-body)',
        boxShadow:   '0 8px 32px rgba(0,0,0,0.5)',
        opacity:     '0',
        transition:  'opacity 0.35s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        whiteSpace:  'nowrap',
    });

    el.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:inherit;font-size:1rem;opacity:0.7;padding:0;margin-left:0.25rem">✕</button>`;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        el.style.opacity   = '0';
        el.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => el.remove(), 400);
    }, 5000);
}

/* ── BACK TO TOP ── */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── MAGNETIC BUTTONS ── */
function initMagnetic() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x    = (e.clientX - rect.left - rect.width  / 2) * 0.25;
            const y    = (e.clientY - rect.top  - rect.height / 2) * 0.25;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/* ── MARQUEE PAUSE ON HOVER ── */
function initMarquee() {
    const track = document.querySelector('.marquee__track');
    if (!track) return;
    const wrap = track.parentElement;
    wrap.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    wrap.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}
