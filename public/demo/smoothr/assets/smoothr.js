/* Smoothr theme scripts. No dependencies. The page works without JS; this adds the menu and the kit's live pricing. */
(function () {
  'use strict';

  /* Mobile menu */
  var toggle = document.querySelector('[data-nav-toggle]');
  var nav = document.getElementById('sm-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
  }

  /* Kit: variant choice, live price, subscribe & save */
  document.querySelectorAll('[data-kit]').forEach(function (root) {
    var form = root.querySelector('[data-kit-form]');
    if (!form) return;

    var variants = [];
    var format = '${{amount}}';
    var label = 'Add to cart';
    try { variants = JSON.parse(root.querySelector('[data-kit-variants]').textContent); } catch (e) { /* no variants */ }
    try {
      var cfg = JSON.parse(root.querySelector('[data-kit-money]').textContent);
      format = cfg.format || format;
      label = cfg.label || label;
    } catch (e) { /* defaults */ }

    var money = function (cents) {
      var amount = (cents / 100).toFixed(2);
      var withCommas = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return format
        .replace('{{amount_no_decimals}}', (cents / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        .replace('{{amount_with_comma_separator}}', amount.replace('.', ','))
        .replace('{{amount}}', withCommas)
        .replace(/<[^>]*>/g, '');
    };

    var idInput = form.querySelector('[data-kit-id]');
    var priceEl = root.querySelector('[data-kit-price]');
    var compareEl = root.querySelector('[data-kit-compare]');
    var pctEl = root.querySelector('[data-kit-pct]');
    var addBtn = form.querySelector('[data-kit-add]');
    var addLabel = form.querySelector('[data-kit-label]');
    var img = root.querySelector('[data-kit-media] img');

    form.addEventListener('change', function (e) {
      if (!e.target.hasAttribute('data-kit-option')) return;
      var chosen = [];
      form.querySelectorAll('[data-kit-option]:checked').forEach(function (input) {
        chosen[Number(input.getAttribute('data-kit-option')) - 1] = input.value;
      });
      var v = variants.filter(function (x) {
        return chosen.every(function (val, i) { return !val || x.options[i] === val; });
      })[0];
      if (!v) { addBtn.disabled = true; addLabel.textContent = 'Unavailable'; return; }
      idInput.value = v.id;
      priceEl.textContent = money(v.price);
      var hasCmp = v.compare_at_price && v.compare_at_price > v.price;
      compareEl.hidden = !hasCmp;
      pctEl.hidden = !hasCmp;
      if (hasCmp) {
        compareEl.textContent = money(v.compare_at_price);
        pctEl.textContent = Math.round((v.compare_at_price - v.price) * 100 / v.compare_at_price) + '% OFF';
      }
      addBtn.disabled = !v.available;
      addLabel.textContent = v.available ? label + ' — ' + money(v.price) : 'Sold out';
      if (img && v.featured_image && v.featured_image.src) { img.src = v.featured_image.src; img.removeAttribute('srcset'); }
      var url = new URL(window.location.href);
      url.searchParams.set('variant', v.id);
      window.history.replaceState({}, '', url);
    });

    /* Subscribe & save adds the kit plus the blade refill on its subscription plan, then opens the cart */
    var refillId = form.querySelector('[data-refill-id]');
    var refillPlan = form.querySelector('[data-refill-plan]');
    var errorEl = form.querySelector('[data-kit-error]');
    form.addEventListener('submit', function (e) {
      var plan = form.querySelector('[data-kit-plan]:checked');
      if (!plan || plan.value !== 'sub' || !refillId || !window.fetch) return;
      e.preventDefault();
      addBtn.disabled = true;
      if (errorEl) errorEl.hidden = true;
      var root_ = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
      fetch(root_ + 'cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [
          { id: Number(idInput.value), quantity: 1 },
          { id: Number(refillId.value), quantity: 1, selling_plan: Number(refillPlan.value) }
        ] })
      }).then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      }).then(function (r) {
        if (!r.ok) throw new Error(r.data.description || r.data.message || 'Could not add to cart');
        window.location.href = root_ + 'cart';
      }).catch(function (err) {
        addBtn.disabled = false;
        if (errorEl) { errorEl.textContent = err.message; errorEl.hidden = false; }
      });
    });
  });
})();
