/* ============================================================
   SAIFI BARBER SHOP — main.js
   ============================================================ */

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
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

/* ── NAV SCROLL ─────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MOBILE BURGER ───────────────────────────────────────────── */
const burger    = document.getElementById('burger');
const navLinks  = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

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

// Eased scroll progress — `smooth` chases the real scroll target every frame
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
  '.service-card, .section-header, .info-block, .stat, .calendly-wrapper, .map-container, .insta-cta-inner'
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
