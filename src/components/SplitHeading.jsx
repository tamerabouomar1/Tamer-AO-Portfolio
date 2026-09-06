import { useEffect, useRef } from "react";

/* Fonts, once, for the whole app rather than per heading.
   Splitting measures glyph positions, so doing it against fallback metrics
   and then letting the real face swap in underneath jolts every character.
   `document.fonts.ready` is the gate; this promise is shared so nine
   headings do not each register their own callback. */
const fontsReady =
  typeof document === "undefined"
    ? Promise.resolve()
    : document.fonts?.ready ?? Promise.resolve();

/* GSAP is loaded on demand and only once, no matter how many headings ask.
   See the note on cost below for why it is not a static import. */
let gsapReady;
function loadGsap() {
  gsapReady ||= Promise.all([import("gsap"), import("gsap/SplitText")]).then(
    ([core, plugin]) => {
      core.gsap.registerPlugin(plugin.SplitText);
      return { gsap: core.gsap, SplitText: plugin.SplitText };
    }
  );
  return gsapReady;
}

/* ---------------------------------------------------------------------------
   A page <h1> whose letters rise in one after another.

   This is the one thing GSAP is here for. Framer Motion animates elements; it
   cannot reach inside a text node and address the letters, so a headline can
   only ever fade as a single block. SplitText rewrites the heading into
   per-character elements at runtime and hands them back as an array we can
   stagger. Everything else on the site stays on Framer Motion — two engines
   doing the same fade would be pure weight.

   Things this is careful about, in the order they can bite:

   1. Never leaving the heading invisible. A `from` tween's first act is to
      hide its targets; if anything kills it before it plays, the h1 is a
      blank space forever. That is the failure this component is built
      around — hence the failsafe below, and hence nothing being hidden until
      everything needed to un-hide it has already arrived. It is the rule
      Page.jsx's useReveal already follows: "animation failed" must never be
      able to mean "no content".

   2. Cost. gsap + SplitText is ~31 kB gzipped — a sixth of the main bundle,
      for decoration. So it is dynamically imported: it lands in its own
      chunk, off the critical path, and the heading is plain readable text
      the entire time it is in flight. Nothing about the page waits for it.

   3. React 18 StrictMode, which mounts, unmounts and remounts every effect.
      Each run owns its `cancelled` flag, so the pass that gets torn down can
      never leave a split or a tween behind for the surviving pass to trip
      over. An earlier version created the tween inside a `.then()` under
      useGSAP, outside the gsap context that was supposed to own it — the
      remount killed the tween after it had hidden the letters and the
      headline stayed blank. Hence the explicit context here.

   4. SEO. entry-server.jsx renders on Node, where effects never fire, so the
      prerendered HTML in dist/<route>/index.html carries the plain heading.
      Crawlers that do not run JavaScript see the h1 as written.

   5. Layout shift. The split only wraps existing glyphs and animates
      `opacity` and `yPercent`. No masks, no overflow:hidden, no width or
      height touched. .topbar__title runs a 1.18 line-height; a masked reveal
      at that leading would guillotine every descender.

   6. Screen readers. Twenty-three elements of one letter each is twenty-three
      announcements. SplitText's aria:"auto" puts an aria-label carrying the
      whole string on the h1 and hides the pieces, so assistive tech reads a
      single heading.

   7. The keyed inner <span>, which is load-bearing — see the note on it
      below. Without it the legal pages render the wrong heading.
   --------------------------------------------------------------------------- */
export default function SplitHeading({
  children,
  className = "topbar__title",
  as: Tag = "h1",
  delay = 0.15,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let ctx;
    let split;
    let guard;
    let cleanup;

    Promise.all([loadGsap(), fontsReady]).then(([{ gsap, SplitText }]) => {
      if (cancelled || !ref.current) return;

      const el = ref.current;
      const restore = () => split?.revert();

      ctx = gsap.context(() => {
        split = new SplitText(el, { type: "chars", aria: "auto" });

        const tween = gsap.from(split.chars, {
          yPercent: 40,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          delay,
          /* `each` rather than a bare number, so the cadence is identical
             whether the heading is "About Tamer Abou Omar" or "Free Website
             Templates & What a Site Costs". A total `amount` would compress
             the long ones into a blur and stretch the short ones to a crawl. */
          stagger: { each: 0.016, from: "start" },
          /* Once the letters have landed nothing needs the wrappers, and
             leaving them in means React and GSAP both believe they own the
             same DOM. Put the plain text node back. */
          onComplete: restore,
        });

        /* Failsafe. If the tween is killed between hiding the letters and
           finishing — a fast route change, a throttled ticker in a
           background tab, a future refactor that gets the ordering wrong —
           this restores the heading rather than leaving a hole in the page.
           Comfortably longer than the animation, so it never fires normally. */
        guard = setTimeout(() => {
          if (tween.progress() < 1) restore();
        }, (delay + 2.5) * 1000);
      }, el);

      cleanup = () => {
        clearTimeout(guard);
        ctx?.revert();
        restore();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [children, delay]);

  /* The inner span, and its key, are load-bearing — not stray markup.

     SplitText rebuilds the heading from its text content, so its revert()
     leaves behind a text node that is not the one React is holding. React
     then writes later updates into a detached node and the screen never
     changes. Legal.jsx is where that shows: one <h1> serves all four
     policies, so /terms rendered with "Privacy Policy" still on it while
     document.title said Terms.

     Keying this span on the text takes React off the patch-in-place path.
     New words mean a new key, which means React removes the whole span and
     inserts a fresh one — an element-level operation that does not care what
     GSAP did to the old span's insides. The <h1> and its class stay put, so
     nothing about the styling or the document outline moves. */
  const text = typeof children === "string" || typeof children === "number"
    ? String(children)
    : undefined;

  return (
    <Tag className={className}>
      <span key={text} ref={ref} className="splitline">
        {children}
      </span>
    </Tag>
  );
}
