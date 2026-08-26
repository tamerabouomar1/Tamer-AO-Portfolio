/* ============================================================
   SALON NIZAR, main.js
   ============================================================ */

/* ── CUSTOM CURSOR (pointer devices only) ──────────────────────
   Skipped entirely on touch screens: there's no cursor to draw and
   the rAF loop would just burn battery on phones.
   ──────────────────────────────────────────────────────────── */
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer) {
  const cursorDot  = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className  = 'cursor-dot';
  cursorRing.className = 'cursor-ring';
  document.body.append(cursorDot, cursorRing);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  ;(function animateCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorDot.style.cssText  = `left:${mx}px;top:${my}px`;
    cursorRing.style.cssText = `left:${rx}px;top:${ry}px`;
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
} else {
  document.body.style.cursor = 'auto';
}

/* ── NAV SCROLL ─────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MOBILE BURGER ───────────────────────────────────────────── */
const burger    = document.getElementById('burger');
const navLinks  = document.querySelector('.nav-links');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', String(open));
  // lock background scrolling while the full-screen menu is up
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.setAttribute('aria-expanded', 'false');
burger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
// Esc closes, and never leave the menu open when rotating back to desktop
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
window.addEventListener('resize', () => { if (window.innerWidth > 768) setMenu(false); });

/* ── STICKY BOOK BAR (mobile) ────────────────────────────────
   Slides up once the hero is behind you, hides again over the
   booking section so it never covers the thing it points at.
   ──────────────────────────────────────────────────────────── */
const bookBar = document.getElementById('book-bar');
if (bookBar) {
  const bookingSection = document.getElementById('booking');
  window.addEventListener('scroll', () => {
    const past = window.scrollY > window.innerHeight * 0.9;
    let overBooking = false;
    if (bookingSection) {
      const r = bookingSection.getBoundingClientRect();
      overBooking = r.top < window.innerHeight && r.bottom > 0;
    }
    bookBar.classList.toggle('show', past && !overBooking);
  }, { passive: true });
}

/* ── CINEMATIC HERO SCENE (scroll-driven camera) ─────────────
   As you scroll through the tall hero, the barber-tools flat-lay:
     • racks from blurred → sharp  (focus pull)
     • dollies in slightly         (scale)
     • pans across                 (translate)
     • lifts out of darkness       (brightness)
   Meanwhile the hero text gently fades + lifts away.
   ──────────────────────────────────────────────────────────── */
const hero        = document.getElementById('hero');
const sceneTools  = document.getElementById('scene-tools');
const sceneVideo  = document.getElementById('scene-video');
const sceneSheen  = document.getElementById('scene-sheen');
const vignette    = document.querySelector('.scene-vignette');
const heroContent = document.getElementById('hero-content');
const scrollHint  = document.querySelector('.scroll-hint');

// The clip plays natively (its own cinematic pan) for buttery-smooth motion.
// Scroll only drives the focus-pull / dolly / brightness on top of it.
if (sceneVideo) {
  const tryPlay = () => sceneVideo.play().catch(() => {});
  sceneVideo.addEventListener('canplay', tryPlay, { once: true });
  tryPlay();
  // If the browser can't decode the file, the SVG fallback stays visible.
  sceneVideo.addEventListener('error', () => { sceneVideo.style.display = 'none'; });
}

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const lerp  = (a, b, t) => a + (b - a) * t;
const ease  = t => 1 - Math.pow(1 - t, 3);   // easeOutCubic

// Eased scroll progress, `smooth` chases the real scroll target every frame
// so the focus-pull and dolly glide instead of snapping with each wheel step.
let smooth = 0;

function cinematicHero() {
  const vh    = window.innerHeight;
  const total = hero.offsetHeight - vh;          // total scroll runway
  const y     = window.scrollY;
  const target = clamp(y / total, 0, 1);

  // Critically-damped follow → silky motion regardless of input cadence
  smooth += (target - smooth) * 0.12;
  if (Math.abs(target - smooth) < 0.0004) smooth = target;
  const sp = smooth;

  // Focus pull: soft for the first third, then crisp
  const focus = ease(clamp(sp / 0.34, 0, 1));
  const blur  = lerp(16, 0, focus);

  // Lift out of darkness
  const bright = lerp(0.5, 1.06, ease(clamp(sp / 0.45, 0, 1)));

  // Gentle dolly + slight parallax (the clip supplies its own pan, so keep this subtle)
  const scale = lerp(1.12, 1.0, sp);
  const panX  = lerp(34, -34, sp);
  const panY  = lerp(20, -20, sp);

  const filter = `blur(${blur}px) brightness(${bright}) contrast(1.04) saturate(1.02)`;
  const transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${scale})`;

  sceneTools.style.filter = filter;
  sceneTools.style.transform = transform;
  if (sceneVideo) {
    sceneVideo.style.filter = filter;
    sceneVideo.style.transform = transform;
  }

  // Light sweep glides across and peaks mid-scroll
  if (sceneSheen) {
    sceneSheen.style.transform = `translate(${lerp(-50, 50, sp)}px, ${lerp(-26, 26, sp)}px)`;
    sceneSheen.style.opacity   = String(0.35 + Math.sin(sp * Math.PI) * 0.5);
  }
  if (vignette) vignette.style.opacity = String(lerp(1, 0.55, focus));

  // Hero text fades + lifts within the first viewport of scroll
  const tp = clamp(y / (vh * 0.85), 0, 1);
  heroContent.style.opacity   = String(1 - tp);
  heroContent.style.transform = `translateY(${-tp * 80}px) scale(${1 - tp * 0.04})`;

  if (scrollHint) {
    scrollHint.style.opacity = y < 60 ? '1' : '0';
    scrollHint.style.pointerEvents = y < 60 ? 'auto' : 'none';
  }
  requestAnimationFrame(cinematicHero);
}
requestAnimationFrame(cinematicHero);

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.service-card, .treat-card, .section-header, .info-block, .booking-card, .map-container, .insta-cta-inner'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── ACTIVE NAV HIGHLIGHT ───────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── FRESHA POPUP WINDOW ─────────────────────────────────────
   Fresha forbids being iframed (frame-ancestors CSP), so a true
   in-page embed is impossible. The closest legitimate thing is a
   compact popup window layered over the site: on desktop it reads
   as a booking widget rather than navigating away. On phones a
   popup is meaningless, so those fall through to a normal new tab.
   The href stays intact, so this still works with JS disabled.
   ──────────────────────────────────────────────────────────── */
(function freshaPopup() {
  const links = document.querySelectorAll('a[href*="fresha.com"]');
  if (!links.length) return;

  const wantsPopup = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.innerWidth > 900;

  links.forEach(a => {
    a.addEventListener('click', e => {
      if (!wantsPopup()) return;              // phones/tablets: normal new tab
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

      const w = 460, h = Math.min(820, screen.availHeight - 80);
      const left = Math.round(screen.availLeft + (screen.availWidth - w) / 2);
      const top  = Math.round(screen.availTop + (screen.availHeight - h) / 2);
      const win = window.open(
        a.href, 'freshaBooking',
        `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
      if (win) { e.preventDefault(); win.focus(); }   // blocked? let the link work
    });
  });
})();
