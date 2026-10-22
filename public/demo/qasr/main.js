// Every handler lives here and is wired with addEventListener:
// the CSP (script-src 'self') blocks inline onclick= and <script> blocks.
(() => {
  const root = document.documentElement;
  root.classList.add('js');

  // ---- header border once the page moves ----
  const top = document.querySelector('[data-top]');
  const onScroll = () => top && top.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- phone menu ----
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  if (burger && nav) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => e.target.closest('a') && setMenu(false));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
  }

  // ---- "is my date free?" -> WhatsApp ----
  // ---- nav: mark the section on screen ----
  // On the home page the in-page links (Occasions, Book a Visit, FAQ,
  // Find Us) light up while their section crosses the middle of the screen.
  // Other pages mark themselves with aria-current in the HTML.
  const spied = [...document.querySelectorAll('.nav a[href^="#"]')]
    .map((a) => [a, document.querySelector(a.getAttribute('href'))])
    .filter(([, el]) => el);
  if (spied.length && 'IntersectionObserver' in window) {
    const onScreen = new Set();
    const mark = () => {
      const hit = spied.find(([, el]) => onScreen.has(el));
      spied.forEach(([a]) => a.classList.toggle('is-active', !!hit && a === hit[0]));
    };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)));
      mark();
    }, { rootMargin: '-45% 0px -50% 0px' });
    spied.forEach(([, el]) => spy.observe(el));
  }

  // ---- occasions: first few shown, the rest behind a toggle ----
  const occToggle = document.querySelector('[data-occ-toggle]');
  const occList = document.querySelector('[data-occ]');
  if (occToggle && occList) {
    const moreLabel = occToggle.textContent;
    occToggle.addEventListener('click', () => {
      const open = occList.classList.toggle('is-all');
      occToggle.setAttribute('aria-expanded', String(open));
      occToggle.textContent = open ? occToggle.dataset.less : moreLabel;
      // Items hidden until now never crossed the viewport, so reveal them here.
      if (open) occList.querySelectorAll('.occ__item--more').forEach((li) => li.classList.add('is-in'));
    });
  }

  const form = document.querySelector('[data-check]');
  if (form) {
    const d = form.dataset;
    const fill = (tpl, map) => tpl.replace(/\{(\w+)\}/g, (_, k) => map[k] ?? '');

    // A date picked in the form arrives as 2026-06-14. Spell it out in the
    // page's language so the venue reads "Sunday 14 June 2026" in the chat.
    const prettyDate = (iso) => {
      if (!iso) return '';
      const [y, m, day] = iso.split('-').map(Number);
      const date = new Date(y, m - 1, day);
      try {
        return date.toLocaleDateString(d.lang === 'ar' ? 'ar-LB' : 'en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
      } catch {
        return iso;
      }
    };

    // Earliest pickable date is today.
    const dateInput = form.elements.date;
    if (dateInput) {
      const t = new Date();
      dateInput.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const byEmail = e.submitter?.dataset.via === 'email' && d.email;
      if (!d.wa && !byEmail) {
        form.querySelector('[data-note]')?.focus?.();
        return;
      }
      const v = Object.fromEntries(new FormData(form));
      const clean = (s) => String(s || '').trim().slice(0, 80);
      const date = prettyDate(v.date);
      const lines = [
        date ? fill(d.msgAsk, { date }) : d.msgAsknodate,
        clean(v.occasion) && fill(d.msgOccasion, { v: clean(v.occasion) }),
        clean(v.time) && fill(d.msgTime, { v: clean(v.time) }),
        clean(v.guests) && fill(d.msgGuests, { v: clean(v.guests) }),
        clean(v.name) && fill(d.msgName, { v: clean(v.name) }),
      ].filter(Boolean);
      if (byEmail) {
        window.location.href = `mailto:${d.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
        return;
      }
      const href = `https://wa.me/${d.wa}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(href, '_blank', 'noopener');
    });
  }

  // ---- Google map, click to load ----
  // Nothing from Google loads until the visitor asks for it, which is why
  // the site needs no cookie banner. Do not change this to auto-load.
  document.querySelectorAll('[data-map]').forEach((box) => {
    const btn = box.querySelector('[data-map-load]');
    btn?.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.src = box.dataset.src;
      f.title = box.dataset.title || 'Map';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.replaceChildren(f);
      box.classList.add('is-loaded');
    });
  });

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- hero background film ----
  // The still is already on screen; the film only joins when it should:
  // not with reduced motion or data saver, not on 2G, and only after the
  // page has loaded so it never competes with the content. The file matches
  // the screen shape (portrait crop on phones) and the first codec this
  // browser can play. It pauses whenever the hero is off screen.
  const film = document.querySelector('[data-film]');
  const filmToggle = document.querySelector('[data-film-toggle]');
  const net = navigator.connection || {};
  const slowNet = !!net.saveData; // only when the visitor turned data saver on

  // Slow connections get still photos instead: a slow crossfade of real
  // shots of the Qasr, 800 px each, loaded only now. Also kicks in when the
  // film has not started 6 s after it was asked to (Safari does not report
  // connection speed, so this covers it). Stops the moment the film plays.
  const slides = document.querySelector('[data-slides]');
  let slideTimer = null;
  const startSlides = () => {
    if (!slides || slideTimer || calm) return;
    const imgs = [...slides.querySelectorAll('img')];
    imgs.forEach((im) => { im.src = im.dataset.src; });
    let n = 0;
    imgs[0].classList.add('is-on');
    slides.classList.add('is-on');
    slideTimer = setInterval(() => {
      imgs[n].classList.remove('is-on');
      n = (n + 1) % imgs.length;
      imgs[n].classList.add('is-on');
    }, 5000);
  };
  const stopSlides = () => {
    clearInterval(slideTimer);
    slideTimer = 'done';
  };
  if (film && slowNet) startSlides();

  if (film && !calm && !slowNet) {
    const portrait = window.matchMedia('(max-aspect-ratio: 4/5)');
    const pick = () => {
      const list = JSON.parse(portrait.matches ? film.dataset.port : film.dataset.land);
      const ok = (type) => film.canPlayType(type);
      return (list.find(([, t]) => ok(t) === 'probably') || list.find(([, t]) => ok(t) === 'maybe') || [])[0];
    };
    let userPaused = false;
    let visible = true;
    const sync = () => {
      if (!film.src) return;
      if (visible && !userPaused && !document.hidden) film.play().catch(() => {});
      else film.pause();
    };
    const load = () => {
      const src = pick();
      if (!src || film.src.endsWith(src)) return;
      const at = film.currentTime || 0;
      film.src = src;
      film.addEventListener('loadedmetadata', () => { if (at) film.currentTime = at; }, { once: true });
      sync();
    };
    film.addEventListener('playing', () => {
      film.classList.add('is-playing');
      stopSlides();
      if (filmToggle) filmToggle.hidden = false;
    });
    const start = () => {
      load();
      // Turning a phone or resizing across the breakpoint swaps the cut.
      portrait.addEventListener('change', load);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    }).observe(film);
    document.addEventListener('visibilitychange', sync);

    if (filmToggle) {
      filmToggle.addEventListener('click', () => {
        userPaused = !userPaused;
        filmToggle.classList.toggle('is-paused', userPaused);
        filmToggle.setAttribute('aria-label', userPaused ? filmToggle.dataset.play : filmToggle.dataset.pause);
        sync();
      });
    }
  }

  // ---- wedding photos: full-screen viewer ----
  const lb = document.querySelector('[data-lb]');
  if (lb) {
    const img = lb.querySelector('[data-lb-img]');
    const cap = lb.querySelector('[data-lb-cap]');
    const count = lb.querySelector('[data-lb-count]');
    const rtl = document.documentElement.dir === 'rtl';
    const toast = lb.querySelector('[data-lb-toast]');
    // Every photo on the page in one list, wedding after wedding. Arrowing
    // past the last photo of a wedding moves on to the next wedding (with a
    // short notice naming it), and past the last wedding back to the first.
    const all = [...document.querySelectorAll('[data-lb-open]')];
    let i = 0;
    let toastTimer = null;
    const notice = (text) => {
      toast.textContent = text;
      toast.classList.add('is-on');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2600);
    };

    const show = (n, step = 0) => {
      const before = all[i];
      i = (n + all.length) % all.length;
      const b = all[i];
      const group = all.filter((x) => x.dataset.group === b.dataset.group);
      img.src = b.dataset.full;
      img.alt = b.dataset.alt || '';
      cap.textContent = b.dataset.alt || '';
      count.textContent = `${group.indexOf(b) + 1} / ${group.length}`;
      if (step && before && before.dataset.group !== b.dataset.group) {
        notice((step > 0 ? toast.dataset.next : toast.dataset.prev).replace('{t}', b.dataset.title || ''));
      }
      // Restart the fade-in for each photo.
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = '';
      // Warm the next photo so arrowing through feels instant.
      new Image().src = all[(i + 1) % all.length].dataset.full;
    };
    let opener = null;
    all.forEach((b) => {
      b.addEventListener('click', () => {
        opener = b;
        toast.classList.remove('is-on');
        show(all.indexOf(b));
        lb.showModal();
      });
    });
    const next = () => show(i + 1, 1);
    const prev = () => show(i - 1, -1);
    lb.querySelector('[data-lb-next]').addEventListener('click', next);
    lb.querySelector('[data-lb-prev]').addEventListener('click', prev);
    lb.querySelector('[data-lb-close]').addEventListener('click', () => lb.close());
    lb.addEventListener('close', () => opener?.focus());
    // Click on the dark area (not the photo or a button) closes.
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('lb__fig')) lb.close();
    });
    // Arrow keys follow reading direction: in Arabic, left means next.
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') (rtl ? prev : next)();
      if (e.key === 'ArrowLeft') (rtl ? next : prev)();
    });
    // Swipe on phones.
    let x0 = null;
    lb.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    lb.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) < 50) return;
      const forward = rtl ? dx > 0 : dx < 0;
      (forward ? next : prev)();
    });
  }

  // ---- reveal on scroll ----
  // threshold 0 + rootMargin: a fractional threshold never fires on tall
  // elements (learned on the fitness site's shop grid).
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      }),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }
})();
