// KNAIDER — interactions
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav__links');

  // Sticky nav state
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );

  // Scroll reveal (with graceful fallback)
  const revealAll = () =>
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));

  if (!('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
    io.observe(el);
  });

  // Subtle hero parallax
  const grain = document.querySelector('.hero__grain');
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < window.innerHeight) {
        grain.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
    },
    { passive: true }
  );

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();
})();
