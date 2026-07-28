/* Zero-weight card art.

   Every store card needs *something* to look at before you hover it. A
   screenshot per template would be ~4 image requests on a page whose whole
   promise is "these load fast", so instead each card paints a miniature of
   its own hero out of divs — no network, no decode, and it scales perfectly
   on any screen. The real animated preview only loads on hover/tap. */

export default function TemplateMockup({ kind }) {
  if (kind === "jack") {
    return (
      <div className="mk mk--jack" aria-hidden="true">
        <div className="mk-nav">
          <i /><i /><i /><i />
        </div>
        <div className="mk-jack__head">HI, I&apos;M JACK</div>
        <div className="mk-jack__figure" />
        <div className="mk-jack__foot">
          <span className="mk-line" />
          <span className="mk-pill mk-pill--grad" />
        </div>
      </div>
    );
  }

  if (kind === "vex") {
    return (
      <div className="mk mk--vex" aria-hidden="true">
        <div className="mk-vex__sky" />
        <div className="mk-vex__nav">
          <b>VEX</b>
          <span className="mk-line" />
          <span className="mk-pill mk-pill--white" />
        </div>
        <div className="mk-vex__body">
          <div className="mk-vex__head">
            Shaping tomorrow
            <br />
            with vision and action.
          </div>
          <div className="mk-vex__row">
            <span className="mk-pill mk-pill--white" />
            <span className="mk-pill mk-pill--ghost" />
          </div>
        </div>
      </div>
    );
  }

  if (kind === "toonhub") {
    return (
      <div className="mk mk--toon" aria-hidden="true">
        <div className="mk-toon__ghost">3D SHAPE</div>
        <span className="mk-toon__fig mk-toon__fig--l" />
        <span className="mk-toon__fig mk-toon__fig--c" />
        <span className="mk-toon__fig mk-toon__fig--r" />
        <div className="mk-toon__foot">
          <span className="mk-dot" />
          <span className="mk-dot" />
        </div>
      </div>
    );
  }

  // oddy
  return (
    <div className="mk mk--oddy" aria-hidden="true">
      <div className="mk-oddy__logo">Viktor Oddy</div>
      <div className="mk-oddy__head">
        Build the next <em>wave,</em>
        <br />
        the <em>bold way.</em>
      </div>
      <span className="mk-line" />
      <span className="mk-line mk-line--short" />
      <div className="mk-oddy__row">
        <span className="mk-pill mk-pill--dark" />
        <span className="mk-pill mk-pill--pale" />
      </div>
      <div className="mk-oddy__strip">
        <i /><i /><i />
      </div>
    </div>
  );
}
