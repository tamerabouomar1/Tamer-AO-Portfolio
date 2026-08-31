/* ============================================================
   KITCHEN GARAGE — app logic
   Vanilla JS. State persists in localStorage (demo back-end).
   ============================================================ */
(function () {
  "use strict";

  const D = window.KG_DATA;
  const R = D.restaurant;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- storage helpers ---------- */
  const load = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  /* ---------- state ---------- */
  const state = {
    cart: load("kg_cart", {}),          // { itemId: qty }
    users: load("kg_users", {}),        // { email: {profile} }
    session: load("kg_session", null),  // email of logged-in user
    checkout: { mode: "delivery", payment: "cod" },
  };

  const itemIndex = {};
  D.menu.forEach((cat) => cat.items.forEach((it) => (itemIndex[it.id] = { ...it, cat: cat.name })));

  const money = (n) => D.currency + (Math.round(n * 100) / 100).toFixed(2);
  const currentUser = () => (state.session && state.users[state.session]) || null;

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.hidden = false;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastT);
    toastT = setTimeout(() => { el.classList.remove("show"); setTimeout(() => (el.hidden = true), 250); }, 2200);
  }

  /* =========================================================
     POPULATE STATIC CONTENT
     ========================================================= */
  function fillStatic() {
    $("#heroTagline").textContent = R.blurb;
    $("#heroMeta").innerHTML =
      `<div>⭐ <span>${R.rating}</span> · ${R.reviewCount} reviews</div>` +
      `<div>📍 <span>${R.area}</span></div>` +
      `<div>🛵 <span>${R.freeDeliveryOver ? "Free delivery over " + money(D.freeDeliveryOver) : "Delivery available"}</span></div>`;

    $("#stripDelivery").textContent = D.deliveryFee ? money(D.deliveryFee) + " delivery" : "Free delivery";
    $("#stripRating").textContent = R.rating + " rating";

    $("#reviewsSummary").textContent = `${R.rating} ★ average from ${R.reviewCount}+ Google reviews`;
    $("#reviewsGrid").innerHTML = D.reviews
      .map((r) => `<div class="review">
          <div class="review__stars" aria-label="${r.stars} out of 5 stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
          <p class="review__text">“${r.text}”</p>
          <p class="review__name">— ${r.name}</p>
        </div>`).join("");
    $("#googleReviewsLink").href = R.googleReviews;

    // location
    $("#locAddress").textContent = R.address;
    $("#directionsLink").href = R.mapsDirections;
    $("#footerDirections").href = R.mapsDirections;
    $("#locHours").innerHTML = R.hours.map((h) => `<li>${h.d} <span>${h.h}</span></li>`).join("");
    const tel = "tel:" + R.phone.replace(/\s/g, "");
    $("#locPhone").textContent = R.phone; $("#locPhone").href = tel;
    $("#footerPhone").href = tel;
    $("#locInsta").href = R.instagram;
    $("#footerInsta").href = R.instagram;
    $("#footerWhatsapp").href = "https://wa.me/" + R.whatsapp.replace(/[^0-9]/g, "");
    $("#mapFrame").src = R.mapEmbed;
    $("#footerBlurb").textContent = R.tagline;
    $("#year").textContent = new Date().getFullYear();
  }

  /* =========================================================
     MENU
     ========================================================= */
  function buildMenu() {
    // tabs
    $("#menuTabs").innerHTML = D.menu
      .map((c, i) => `<button class="menu-tab ${i === 0 ? "active" : ""}" role="tab" data-cat="${c.id}">
          ${c.emoji} ${c.name} <span class="count">${c.items.length}</span></button>`).join("");

    // grid (all groups rendered; tabs scroll to group banner)
    $("#menuGrid").innerHTML = D.menu.map((c) => {
      const cards = c.items.map((it) => cardHTML(it)).join("");
      const banner = `<div class="menu__banner" id="group-${c.id}">
          <img src="${c.image}" alt="${c.name}" loading="lazy">
          <div class="menu__banner__grad"></div>
          <div class="menu__banner__t"><h3>${c.emoji} ${c.name}</h3>${c.note ? `<p>${c.note}</p>` : ""}</div>
        </div>`;
      return banner + cards;
    }).join("");

    syncMenuQty();
  }

  /* ---------- featured / flavors / gallery / hero image ---------- */
  function renderExtras() {
    const hb = $(".hero__bg");
    if (hb && D.hero) {
      hb.style.backgroundImage =
        "linear-gradient(90deg, rgba(10,11,13,.95) 0%, rgba(10,11,13,.62) 46%, rgba(10,11,13,.28) 100%)," +
        "linear-gradient(0deg, var(--bg), transparent 60%)," +
        "url('" + D.hero + "')";
      hb.style.backgroundSize = "cover";
      hb.style.backgroundPosition = "center right";
    }

    if (D.featured) $("#featuredGrid").innerHTML = D.featured.map((f) => `
      <article class="feat">
        <img src="${f.image}" alt="${f.name}" loading="lazy">
        <div class="feat__grad"></div>
        <div class="feat__body">
          <div class="feat__name">${f.name}</div>
          <div class="feat__desc">${f.desc}</div>
          <div class="feat__row"><span class="feat__price">${money(f.price)}</span>
            <a href="#menu" class="btn btn--primary">Order</a></div>
        </div>
      </article>`).join("");

    if (D.wingFlavors) $("#flavorsGrid").innerHTML = D.wingFlavors.map((f) => `
      <span class="flavor">${f.n}
        ${f.heat ? `<span class="heat" aria-label="${f.heat} heat">${"🌶".repeat(f.heat)}</span>` : ""}
        ${f.limited ? `<span class="lim">LIMITED</span>` : ""}
      </span>`).join("");
  }

  function badges(it) {
    let b = "";
    if (it.isNew) b += `<span class="badge badge--new">NEW</span>`;
    if (it.popular) b += `<span class="badge badge--popular">★ Popular</span>`;
    if (it.spicy) b += `<span class="badge badge--spicy">🌶 Spicy</span>`;
    if (it.veg) b += `<span class="badge badge--veg">🌱 Veg</span>`;
    return b ? `<div class="card__badges">${b}</div>` : "";
  }

  function priceHTML(it) {
    const price = it.price > 0
      ? `<span class="card__price">${money(it.price)}</span>`
      : `<span class="card__price card__price--free">Free swap</span>`;
    return `<div class="card__pricewrap">${price}${it.opt ? `<span class="card__opt">${it.opt}</span>` : ""}</div>`;
  }

  function cardHTML(it) {
    return `<article class="card" data-card="${it.id}">
      <div class="card__media">${it.emoji}${badges(it)}</div>
      <div class="card__body">
        <div class="card__name">${it.name}</div>
        <p class="card__desc">${it.desc}</p>
        <div class="card__foot">
          ${priceHTML(it)}
          <div class="card__action" data-action-for="${it.id}"></div>
        </div>
      </div>
    </article>`;
  }

  function actionHTML(id) {
    const qty = state.cart[id] || 0;
    if (qty > 0) {
      return `<div class="stepper">
          <button data-dec="${id}" aria-label="Remove one">−</button>
          <span aria-live="polite">${qty}</span>
          <button data-inc="${id}" aria-label="Add one">+</button>
        </div>`;
    }
    return `<button class="btn btn--primary card__add" data-inc="${id}">Add +</button>`;
  }

  function syncMenuQty() {
    $$("[data-action-for]").forEach((el) => (el.innerHTML = actionHTML(el.dataset.actionFor)));
  }

  /* =========================================================
     CART
     ========================================================= */
  function cartCount() { return Object.values(state.cart).reduce((a, b) => a + b, 0); }
  function subtotal() { return Object.entries(state.cart).reduce((s, [id, q]) => s + (itemIndex[id] ? itemIndex[id].price * q : 0), 0); }
  function deliveryCost() {
    if (state.checkout.mode === "pickup") return 0;
    const sub = subtotal();
    if (D.freeDeliveryOver && sub >= D.freeDeliveryOver) return 0;
    return D.deliveryFee;
  }
  function grandTotal() { return subtotal() + deliveryCost(); }

  function addItem(id, delta) {
    const q = (state.cart[id] || 0) + delta;
    if (q <= 0) delete state.cart[id]; else state.cart[id] = q;
    save("kg_cart", state.cart);
    syncMenuQty(); renderCart(); updateBadge();
    if (delta > 0) toast(`${itemIndex[id].name} added`);
  }
  function removeItem(id) { delete state.cart[id]; save("kg_cart", state.cart); syncMenuQty(); renderCart(); updateBadge(); }

  function updateBadge() {
    const n = cartCount(); const b = $("#cartBadge");
    b.textContent = n; b.hidden = n === 0;
  }

  function renderCart() {
    const body = $("#cartBody"), foot = $("#cartFoot");
    const ids = Object.keys(state.cart);
    if (!ids.length) {
      body.innerHTML = `<div class="cart-empty"><div class="big">🛒</div>
        <p>Your cart is empty.</p><p style="color:var(--muted-2);font-size:14px">Add something tasty from the menu.</p></div>`;
      foot.innerHTML = `<a href="#menu" class="btn btn--primary btn--block" data-close-cart>Browse the menu</a>`;
      return;
    }
    body.innerHTML = ids.map((id) => {
      const it = itemIndex[id], q = state.cart[id];
      return `<div class="cart-line">
        <div class="cart-line__emoji">${it.emoji}</div>
        <div class="cart-line__main">
          <div class="cart-line__name">${it.name}</div>
          <div class="cart-line__price">${money(it.price)} each</div>
          <button class="cart-line__remove" data-remove="${id}">Remove</button>
        </div>
        <div class="cart-line__right">
          <strong>${money(it.price * q)}</strong>
          <div class="stepper">
            <button data-dec="${id}" aria-label="Remove one">−</button>
            <span>${q}</span>
            <button data-inc="${id}" aria-label="Add one">+</button>
          </div>
        </div>
      </div>`;
    }).join("");

    const sub = subtotal(), del = deliveryCost();
    const belowMin = sub < D.minOrder && state.checkout.mode === "delivery";
    foot.innerHTML =
      `<div class="totals">
        <div class="totals__row"><span>Subtotal</span><strong>${money(sub)}</strong></div>
        <div class="totals__row"><span>Delivery</span><strong>${del === 0 ? "Free" : money(del)}</strong></div>
        <div class="totals__row totals__row--grand"><span>Total</span><span>${money(sub + del)}</span></div>
      </div>` +
      (belowMin ? `<p class="minwarn">⚠ Minimum delivery order is ${money(D.minOrder)}. Add ${money(D.minOrder - sub)} more.</p>` : "") +
      `<button class="btn btn--primary btn--block btn--lg" id="checkoutBtn" ${belowMin ? "disabled" : ""}>Checkout · ${money(sub + del)}</button>`;
  }

  /* ---------- drawer open/close ---------- */
  function openCart() { renderCart(); $("#cartDrawer").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden", "false"); showOverlay(); }
  function closeCart() { $("#cartDrawer").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden", "true"); maybeHideOverlay(); }

  function showOverlay() { $("#overlay").hidden = false; }
  function maybeHideOverlay() {
    const drawerOpen = $("#cartDrawer").classList.contains("open");
    const modalOpen = $("#modal").classList.contains("open");
    if (!drawerOpen && !modalOpen) $("#overlay").hidden = true;
  }

  /* =========================================================
     MODAL
     ========================================================= */
  function openModal(html) {
    $("#modalContent").innerHTML = html;
    $("#modal").classList.add("open"); $("#modal").setAttribute("aria-hidden", "false");
    showOverlay();
    const f = $("#modalContent input, #modalContent button");
    if (f) setTimeout(() => f.focus(), 50);
  }
  function closeModal() { $("#modal").classList.remove("open"); $("#modal").setAttribute("aria-hidden", "true"); maybeHideOverlay(); }

  /* =========================================================
     AUTH
     ========================================================= */
  function updateAccountLabel() {
    const u = currentUser();
    $("#accountLabel").textContent = u ? u.name.split(" ")[0] : "Sign in";
  }

  function authModal(tab) {
    tab = tab || "signup";
    openModal(`
      <h3>Welcome to Kitchen Garage</h3>
      <p class="modal__sub">Sign in to save your address, favorite order & track orders.</p>
      <div class="tabs">
        <button data-auth-tab="signin" class="${tab === "signin" ? "active" : ""}">Sign in</button>
        <button data-auth-tab="signup" class="${tab === "signup" ? "active" : ""}">Create account</button>
      </div>
      <div id="authForm"></div>`);
    renderAuthForm(tab);
  }

  function renderAuthForm(tab) {
    const host = $("#authForm");
    if (tab === "signin") {
      host.innerHTML = `
        <form id="signinForm" novalidate>
          <div class="field"><label for="si-email">Email</label>
            <input id="si-email" type="email" autocomplete="email" placeholder="you@email.com" required>
            <div class="field__err">Enter a valid email.</div></div>
          <div class="field"><label for="si-pass">Password</label>
            <input id="si-pass" type="password" autocomplete="current-password" placeholder="Your password" required>
            <div class="field__err">Enter your password.</div></div>
          <button class="btn btn--primary btn--block btn--lg" type="submit">Sign in</button>
          <p class="form-switch">New here? <button type="button" data-auth-tab="signup">Create an account</button></p>
        </form>`;
    } else {
      host.innerHTML = `
        <form id="signupForm" novalidate>
          <div class="field"><label for="su-name">Full name</label>
            <input id="su-name" type="text" autocomplete="name" placeholder="Jane Doe" required>
            <div class="field__err">Please enter your name.</div></div>
          <div class="grid-2">
            <div class="field"><label for="su-email">Email</label>
              <input id="su-email" type="email" autocomplete="email" placeholder="you@email.com" required>
              <div class="field__err">Enter a valid email.</div></div>
            <div class="field"><label for="su-phone">Phone</label>
              <input id="su-phone" type="tel" autocomplete="tel" placeholder="+961 …" required>
              <div class="field__err">Enter your phone.</div></div>
          </div>
          <div class="field"><label for="su-pass">Password</label>
            <input id="su-pass" type="password" autocomplete="new-password" placeholder="At least 6 characters" required>
            <div class="field__err">Use at least 6 characters.</div></div>
          <p class="form-note" style="margin-bottom:14px">After signing up you can save your delivery address & favorite order.</p>
          <button class="btn btn--primary btn--block btn--lg" type="submit">Create account</button>
          <p class="form-switch">Already have an account? <button type="button" data-auth-tab="signin">Sign in</button></p>
        </form>`;
    }
  }

  const validEmail = (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  function setErr(input, on) { input.closest(".field").classList.toggle("field--error", on); return !on; }

  function handleSignup(form) {
    const name = $("#su-name", form), email = $("#su-email", form), phone = $("#su-phone", form), pass = $("#su-pass", form);
    let ok = true;
    ok &= setErr(name, !name.value.trim());
    ok &= setErr(email, !validEmail(email.value.trim()));
    ok &= setErr(phone, phone.value.trim().length < 6);
    ok &= setErr(pass, pass.value.length < 6);
    if (!ok) return;
    const key = email.value.trim().toLowerCase();
    if (state.users[key]) { setErr(email, true); toast("Account exists — please sign in."); return; }
    state.users[key] = {
      name: name.value.trim(), email: key, phone: phone.value.trim(), password: pass.value,
      address: null, favorite: "", orders: [],
    };
    state.session = key;
    save("kg_users", state.users); save("kg_session", state.session);
    updateAccountLabel(); toast(`Welcome, ${state.users[key].name.split(" ")[0]}! 🎉`);
    accountModal();
  }

  function handleSignin(form) {
    const email = $("#si-email", form), pass = $("#si-pass", form);
    let ok = true;
    ok &= setErr(email, !validEmail(email.value.trim()));
    ok &= setErr(pass, !pass.value);
    if (!ok) return;
    const key = email.value.trim().toLowerCase();
    const u = state.users[key];
    if (!u || u.password !== pass.value) { setErr(pass, true); toast("Wrong email or password."); return; }
    state.session = key; save("kg_session", key);
    updateAccountLabel(); toast(`Welcome back, ${u.name.split(" ")[0]}!`);
    accountModal();
  }

  function logout() { state.session = null; save("kg_session", null); updateAccountLabel(); closeModal(); toast("Signed out."); }

  /* =========================================================
     ACCOUNT (profile)
     ========================================================= */
  function accountModal() {
    const u = currentUser();
    if (!u) return authModal("signin");
    const addr = u.address;
    const orders = u.orders || [];
    openModal(`
      <h3>Hi, ${u.name.split(" ")[0]} 👋</h3>
      <p class="modal__sub">${u.email} · ${u.phone}</p>

      <div class="profile-card">
        <h4>📍 Delivery address</h4>
        ${addr
          ? `<p>${addr.street}, Bldg ${addr.building || "-"}${addr.floor ? ", Floor " + addr.floor : ""}<br>${addr.area}, ${addr.city}${addr.notes ? "<br><small style='color:var(--muted)'>Note: " + addr.notes + "</small>" : ""}</p>`
          : `<p style="color:var(--muted)">No saved address yet.</p>`}
        <button class="btn btn--outline edit" data-edit-address>${addr ? "Edit" : "Add address"}</button>
      </div>

      <div class="profile-card">
        <h4>⭐ Favorite order</h4>
        <p>${u.favorite ? u.favorite : `<span style="color:var(--muted)">Not set — tell us your usual!</span>`}</p>
        <button class="btn btn--outline edit" data-edit-fav>${u.favorite ? "Edit" : "Add favorite"}</button>
      </div>

      <div class="profile-card">
        <h4>🧾 Order history</h4>
        ${orders.length
          ? orders.slice().reverse().map((o) =>
              `<div class="order-row"><div>${o.items} item${o.items > 1 ? "s" : ""} · <small>${o.date}</small></div>
               <div><span class="chip">${o.id}</span> &nbsp;<strong>${money(o.total)}</strong></div></div>`).join("")
          : `<p style="color:var(--muted)">No orders yet. Your past orders will appear here.</p>`}
      </div>

      <div style="display:flex;gap:10px;margin-top:8px">
        <a href="#menu" class="btn btn--primary" data-close-modal style="flex:1;justify-content:center">Start an order</a>
        <button class="btn btn--ghost" data-logout>Sign out</button>
      </div>`);
  }

  function addressFormHTML(addr) {
    addr = addr || {};
    return `
      <h3>Delivery address</h3>
      <p class="modal__sub">We'll use this to deliver and to autofill checkout.</p>
      <form id="addressForm" novalidate>
        <div class="field"><label for="ad-street">Street / Area</label>
          <input id="ad-street" placeholder="e.g. Mar Mikhael, Armenia St." value="${addr.street || ""}" required>
          <div class="field__err">Required.</div></div>
        <div class="grid-2">
          <div class="field"><label for="ad-building">Building</label>
            <input id="ad-building" placeholder="Building name/no." value="${addr.building || ""}"></div>
          <div class="field"><label for="ad-floor">Floor / Apt</label>
            <input id="ad-floor" placeholder="Floor / Apt" value="${addr.floor || ""}"></div>
        </div>
        <div class="grid-2">
          <div class="field"><label for="ad-area">District</label>
            <input id="ad-area" placeholder="e.g. Achrafieh" value="${addr.area || ""}" required>
            <div class="field__err">Required.</div></div>
          <div class="field"><label for="ad-city">City</label>
            <input id="ad-city" placeholder="e.g. Beirut" value="${addr.city || R.area}" required>
            <div class="field__err">Required.</div></div>
        </div>
        <div class="field"><label for="ad-notes">Delivery notes (optional)</label>
          <textarea id="ad-notes" rows="2" placeholder="Landmark, gate code, ring twice…">${addr.notes || ""}</textarea></div>
        <button class="btn btn--primary btn--block btn--lg" type="submit">Save address</button>
      </form>`;
  }

  function saveAddress(form, after) {
    const street = $("#ad-street", form), area = $("#ad-area", form), city = $("#ad-city", form);
    let ok = true;
    ok &= setErr(street, !street.value.trim());
    ok &= setErr(area, !area.value.trim());
    ok &= setErr(city, !city.value.trim());
    if (!ok) return false;
    const u = currentUser();
    u.address = {
      street: street.value.trim(), building: $("#ad-building", form).value.trim(),
      floor: $("#ad-floor", form).value.trim(), area: area.value.trim(),
      city: city.value.trim(), notes: $("#ad-notes", form).value.trim(),
    };
    save("kg_users", state.users);
    toast("Address saved ✓");
    if (after) after();
    return true;
  }

  function favModal() {
    const u = currentUser();
    openModal(`
      <h3>Your favorite order</h3>
      <p class="modal__sub">Tell us your usual so we can reorder it in one tap.</p>
      <form id="favForm">
        <div class="field"><label for="fav">Favorite order</label>
          <input id="fav" placeholder="e.g. Double Stack, Loaded Fries, Oreo shake" value="${u.favorite || ""}"></div>
        <button class="btn btn--primary btn--block btn--lg" type="submit">Save favorite</button>
      </form>`);
  }

  /* =========================================================
     CHECKOUT
     ========================================================= */
  function checkoutModal() {
    if (!cartCount()) { toast("Your cart is empty."); return; }
    const u = currentUser();
    const addr = u && u.address;
    const pays = D.payments.filter((p) => p.on);
    state.checkout.payment = state.checkout.payment || pays[0].id;

    openModal(`
      <h3>Checkout</h3>
      <p class="modal__sub">${u ? "Signed in as " + u.email : "Ordering as guest — sign in to save your details."}</p>

      <div class="seg" id="seg">
        <label data-mode="delivery" class="${state.checkout.mode === "delivery" ? "checked" : ""}">
          <span style="font-size:20px">🛵</span><div><div class="seg__t">Delivery</div><div class="seg__s">${D.deliveryFee ? money(D.deliveryFee) + " · 20–30 min" : "Free · 20–30 min"}</div></div></label>
        <label data-mode="pickup" class="${state.checkout.mode === "pickup" ? "checked" : ""}">
          <span style="font-size:20px">🏃</span><div><div class="seg__t">Pickup</div><div class="seg__s">Free · 10–15 min</div></div></label>
      </div>

      <div id="contactBlock">
        <div class="grid-2">
          <div class="field"><label for="co-name">Name</label>
            <input id="co-name" value="${u ? u.name : ""}" placeholder="Your name" required>
            <div class="field__err">Required.</div></div>
          <div class="field"><label for="co-phone">Phone</label>
            <input id="co-phone" value="${u ? u.phone : ""}" placeholder="+961 …" required>
            <div class="field__err">Required.</div></div>
        </div>
      </div>

      <div id="addrBlock" ${state.checkout.mode === "pickup" ? "hidden" : ""}>
        <div class="field"><label for="co-street">Delivery address</label>
          <input id="co-street" value="${addr ? addr.street : ""}" placeholder="Street / Area" required>
          <div class="field__err">Required for delivery.</div></div>
        <div class="grid-2">
          <div class="field"><label for="co-area">District</label>
            <input id="co-area" value="${addr ? addr.area : ""}" placeholder="District" required>
            <div class="field__err">Required.</div></div>
          <div class="field"><label for="co-city">City</label>
            <input id="co-city" value="${addr ? addr.city : R.area}" placeholder="City"></div>
        </div>
        ${u ? `<label style="display:flex;gap:8px;align-items:center;color:var(--muted);font-size:14px;margin:-4px 0 16px">
            <input type="checkbox" id="co-saveaddr" ${addr ? "" : "checked"} style="width:auto"> Save this address to my account</label>` : ""}
      </div>

      <h4 style="font-size:15px;color:var(--amber-2);margin:6px 0 12px">Payment method</h4>
      <div class="pay-list" id="payList">
        ${pays.map((p) => `
          <div class="pay ${state.checkout.payment === p.id ? "checked" : ""}" data-pay="${p.id}" role="button" tabindex="0">
            <div class="pay__emoji">${p.emoji}</div>
            <div class="pay__main"><div class="pay__label">${p.label}</div><div class="pay__note">${p.note}</div></div>
            <div class="pay__radio"></div>
          </div>`).join("")}
      </div>
      <div id="cardFields"></div>

      <div class="summary-box" style="margin-top:20px" id="coSummary"></div>
      <button class="btn btn--primary btn--block btn--lg" id="placeOrderBtn">Place order</button>
      <p class="form-note" style="text-align:center;margin-top:10px">🔒 This is a demo. No real payment is charged. Connect Stripe / Whish to go live.</p>
    `);
    renderCardFields();
    renderCheckoutSummary();
  }

  function renderCheckoutSummary() {
    const sub = subtotal(), del = deliveryCost();
    $("#coSummary").innerHTML =
      `<div class="totals__row"><span>${cartCount()} item${cartCount() > 1 ? "s" : ""} subtotal</span><strong>${money(sub)}</strong></div>
       <div class="totals__row"><span>${state.checkout.mode === "pickup" ? "Pickup" : "Delivery"}</span><strong>${del === 0 ? "Free" : money(del)}</strong></div>
       <div class="totals__row totals__row--grand"><span>Total</span><span>${money(sub + del)}</span></div>`;
    const btn = $("#placeOrderBtn");
    if (btn) btn.textContent = `Place order · ${money(sub + del)}`;
  }

  function renderCardFields() {
    const host = $("#cardFields");
    if (state.checkout.payment !== "card") { host.innerHTML = ""; return; }
    host.innerHTML = `
      <div class="card-fields">
        <div class="field"><label for="cc-num">Card number</label>
          <input id="cc-num" inputmode="numeric" placeholder="1234 5678 9012 3456" maxlength="19"></div>
        <div class="grid-2">
          <div class="field"><label for="cc-exp">Expiry</label>
            <input id="cc-exp" placeholder="MM/YY" maxlength="5"></div>
          <div class="field"><label for="cc-cvc">CVC</label>
            <input id="cc-cvc" inputmode="numeric" placeholder="123" maxlength="4"></div>
        </div>
        <p class="form-note">Demo only — card data is not stored or sent anywhere.</p>
      </div>`;
    // light formatting
    const num = $("#cc-num");
    num.addEventListener("input", () => {
      num.value = num.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    });
    const exp = $("#cc-exp");
    exp.addEventListener("input", () => {
      let v = exp.value.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
      exp.value = v;
    });
  }

  function placeOrder() {
    const mode = state.checkout.mode;
    const name = $("#co-name"), phone = $("#co-phone");
    let ok = true;
    ok &= setErr(name, !name.value.trim());
    ok &= setErr(phone, phone.value.trim().length < 6);
    if (mode === "delivery") {
      const street = $("#co-street"), area = $("#co-area");
      ok &= setErr(street, !street.value.trim());
      ok &= setErr(area, !area.value.trim());
    }
    if (!ok) { toast("Please complete the highlighted fields."); return; }

    // save address if requested
    const u = currentUser();
    if (u && mode === "delivery" && $("#co-saveaddr") && $("#co-saveaddr").checked) {
      u.address = {
        street: $("#co-street").value.trim(), building: u.address ? u.address.building : "",
        floor: u.address ? u.address.floor : "", area: $("#co-area").value.trim(),
        city: ($("#co-city").value || R.area).trim(), notes: u.address ? u.address.notes : "",
      };
    }

    const total = grandTotal(), items = cartCount();
    const id = "KG-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const payLabel = (D.payments.find((p) => p.id === state.checkout.payment) || {}).label || "—";

    if (u) {
      u.orders = u.orders || [];
      u.orders.push({ id, total, items, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), mode, payment: payLabel });
      save("kg_users", state.users);
    }

    const orderedLines = Object.entries(state.cart).map(([iid, q]) => `${q}× ${itemIndex[iid].name}`).join(", ");

    // clear cart
    state.cart = {}; save("kg_cart", state.cart);
    syncMenuQty(); updateBadge(); renderCart();

    confirmModal({ id, total, items, mode, payLabel, orderedLines, name: name.value.trim() });
  }

  function confirmModal(o) {
    closeCart();
    const eta = o.mode === "pickup" ? "Ready for pickup in ~10–15 min" : "Arriving in ~20–30 min";
    openModal(`
      <div class="confirm">
        <div class="confirm__check">✅</div>
        <h3>Order confirmed!</h3>
        <p class="modal__sub">Thanks, ${o.name.split(" ")[0]} — we're firing up the grill. 🔥</p>
        <div class="confirm__id">${o.id}</div>
        <div class="summary-box" style="text-align:left;margin-top:14px">
          <div class="totals__row"><span>Items</span><strong>${o.orderedLines}</strong></div>
          <div class="totals__row"><span>Method</span><strong>${o.mode === "pickup" ? "Pickup" : "Delivery"}</strong></div>
          <div class="totals__row"><span>Payment</span><strong>${o.payLabel}</strong></div>
          <div class="totals__row totals__row--grand"><span>Total</span><span>${money(o.total)}</span></div>
        </div>
        <p style="margin:16px 0;color:var(--amber-2);font-weight:600">⏱ ${eta}</p>
        ${currentUser() ? `<p class="form-note">Saved to your order history.</p>` : `<p class="form-note">Tip: <button class="form-switch" style="display:inline" data-open-auth>create an account</button> to save your details next time.</p>`}
        <button class="btn btn--primary btn--block btn--lg" data-close-modal style="margin-top:14px">Done</button>
      </div>`);
  }

  /* =========================================================
     STICKY CATEGORY BAR — scroll spy
     ========================================================= */
  let activeCat = null, spyPaused = false, spyTimer = null;

  function spyPause() {
    spyPaused = true;
    clearTimeout(spyTimer);
    spyTimer = setTimeout(() => { spyPaused = false; }, 700);
  }

  function setActiveTab(id, recenter) {
    if (id === activeCat && !recenter) return;
    activeCat = id;
    const strip = $("#menuTabs");
    let activeEl = null;
    $$(".menu-tab", strip).forEach((t) => {
      const on = t.dataset.cat === id;
      t.classList.toggle("active", on);
      if (on) activeEl = t;
    });
    if (activeEl) {
      const left = activeEl.offsetLeft - strip.clientWidth / 2 + activeEl.offsetWidth / 2;
      strip.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  }

  // Height of the fixed stack (nav + sticky category bar).
  function stackH() { return $("#nav").offsetHeight + $("#menuTabs").offsetHeight; }

  // Absolute Y to scroll a category banner just below the sticky bar.
  function categoryScrollY(id) {
    const el = document.getElementById("group-" + id);
    if (!el) return 0;
    let y = 0, n = el;
    while (n) { y += n.offsetTop; n = n.offsetParent; }
    return Math.max(0, y - stackH() - 20);
  }

  // Highlight the category whose banner has just passed under the sticky bar.
  function updateActiveTab() {
    if (spyPaused) return;
    const triggerY = stackH() + 30;
    let current = D.menu[0].id;
    for (const c of D.menu) {
      const el = document.getElementById("group-" + c.id);
      if (el && el.getBoundingClientRect().top <= triggerY) current = c.id;
    }
    setActiveTab(current);
  }

  // Direct (browser already fires scroll at frame rate; 10 rect reads is cheap
  // and avoids rAF getting throttled/stuck in backgrounded tabs).
  function onScrollSpy() { updateActiveTab(); }

  /* =========================================================
     EVENTS
     ========================================================= */
  function init() {
    fillStatic();
    buildMenu();
    renderExtras();
    updateBadge();
    updateAccountLabel();

    // header
    $("#cartBtn").addEventListener("click", openCart);
    $("#cartClose").addEventListener("click", closeCart);
    $("#accountBtn").addEventListener("click", () => (currentUser() ? accountModal() : authModal("signin")));
    $("#modalClose").addEventListener("click", closeModal);
    $("#overlay").addEventListener("click", () => { closeCart(); closeModal(); });

    // mobile nav
    const burger = $("#burgerBtn"), mob = $("#navMobile");
    burger.addEventListener("click", () => {
      const open = mob.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$("#navMobile a").forEach((a) => a.addEventListener("click", () => { mob.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }));

    // menu tabs -> scroll to group (and pause spy so it doesn't fight the scroll)
    $("#menuTabs").addEventListener("click", (e) => {
      const tab = e.target.closest(".menu-tab"); if (!tab) return;
      setActiveTab(tab.dataset.cat, true);
      spyPause();
      window.scrollTo({ top: categoryScrollY(tab.dataset.cat), behavior: "smooth" });
    });

    // scroll spy keeps the active category in sync with the page
    window.addEventListener("scroll", onScrollSpy, { passive: true });
    activeCat = D.menu[0].id;

    // global click delegation
    document.addEventListener("click", (e) => {
      const t = e.target;
      const inc = t.closest("[data-inc]"); if (inc) return addItem(inc.dataset.inc, 1);
      const dec = t.closest("[data-dec]"); if (dec) return addItem(dec.dataset.dec, -1);
      const rm = t.closest("[data-remove]"); if (rm) return removeItem(rm.dataset.remove);

      if (t.closest("[data-close-cart]")) { closeCart(); return; }
      if (t.closest("#checkoutBtn")) { closeCart(); checkoutModal(); return; }
      if (t.closest(".js-open-cart")) { e.preventDefault(); openCart(); return; }
      if (t.closest(".js-open-account")) { e.preventDefault(); currentUser() ? accountModal() : authModal("signin"); return; }
      if (t.closest("[data-close-modal]")) { closeModal(); return; }
      if (t.closest("[data-logout]")) { logout(); return; }
      if (t.closest("[data-open-auth]")) { authModal("signup"); return; }

      // auth tab switch
      const at = t.closest("[data-auth-tab]");
      if (at) {
        $$("[data-auth-tab]").forEach((b) => { if (b.parentElement.classList.contains("tabs")) b.classList.toggle("active", b === at); });
        renderAuthForm(at.dataset.authTab); return;
      }

      // account edits
      if (t.closest("[data-edit-address]")) { openModal(addressFormHTML(currentUser().address)); return; }
      if (t.closest("[data-edit-fav]")) { favModal(); return; }

      // checkout: mode segment
      const seg = t.closest("[data-mode]");
      if (seg) {
        state.checkout.mode = seg.dataset.mode;
        $$("#seg [data-mode]").forEach((l) => l.classList.toggle("checked", l === seg));
        const ab = $("#addrBlock"); if (ab) ab.hidden = state.checkout.mode === "pickup";
        renderCheckoutSummary(); return;
      }

      // checkout: payment select
      const pay = t.closest("[data-pay]");
      if (pay) {
        state.checkout.payment = pay.dataset.pay;
        $$("#payList .pay").forEach((p) => p.classList.toggle("checked", p === pay));
        renderCardFields(); return;
      }

      if (t.closest("#placeOrderBtn")) { placeOrder(); return; }
    });

    // payment keyboard support
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeModal(); closeCart(); }
      if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("pay")) {
        e.preventDefault(); e.target.click();
      }
    });

    // form submits (delegated)
    document.addEventListener("submit", (e) => {
      const f = e.target;
      if (f.id === "signupForm") { e.preventDefault(); handleSignup(f); }
      else if (f.id === "signinForm") { e.preventDefault(); handleSignin(f); }
      else if (f.id === "addressForm") { e.preventDefault(); saveAddress(f, accountModal); }
      else if (f.id === "favForm") { e.preventDefault(); currentUser().favorite = $("#fav", f).value.trim(); save("kg_users", state.users); toast("Favorite saved ✓"); accountModal(); }
    });

    renderCart();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
