// FabricAID Uniforms — shared behavior
(function () {
  // sticky header (rAF-throttled so scrolling stays smooth)
  var header = document.querySelector('header');
  var ticking = false;
  var update = function () { header.classList.toggle('scrolled', window.scrollY > 20); ticking = false; };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); setTimeout(update, 120); } };
  update(); window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () { navLinks.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  // reveal on scroll
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // count-up: animates the number text only; suffixes (K+, M, +) live in their own span and are never touched
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, target = +el.dataset.count;
      var t0 = performance.now(), dur = 1400;
      var tick = function (now) {
        var p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(function () { el.textContent = target; }, dur + 300);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.cnt[data-count]').forEach(function (c) { cio.observe(c); });

  // portfolio filter
  var bar = document.querySelector('.filter-bar');
  if (bar) {
    var cards = document.querySelectorAll('[data-cat]');
    bar.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.dataset.filter;
        cards.forEach(function (c) {
          c.style.display = (f === 'all' || c.dataset.cat.indexOf(f) !== -1) ? '' : 'none';
        });
      });
    });
  }
})();
