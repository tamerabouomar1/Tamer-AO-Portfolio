/* ---- EDIT THIS ONE LINE: WhatsApp number in international format, digits only ---- */
var WHATSAPP = "96170260403";
/* --------------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  document.querySelectorAll(".js-wa").forEach(function (el) {
    var msg = el.getAttribute("data-msg") || "Hey Coach!";
    el.setAttribute("href", "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* Show the placeholder frame instead of a broken image if a photo isn't in place yet.
     Has to live here, not as an inline onerror — the CSP blocks inline handlers. */
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    var mark = function () {
      var frame = img.closest(".portrait");
      if (frame) frame.classList.add("empty");
    };
    img.addEventListener("error", mark);
    if (img.complete && img.naturalWidth === 0) mark();
  });

  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("stuck", window.scrollY > 12); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
});
