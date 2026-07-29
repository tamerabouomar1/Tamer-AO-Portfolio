import { useState } from "react";

/* A thin line along the bottom edge saying "this is still coming".

   The site loads real websites into cards and full-page scans into the
   project popup — both of which can take a moment on a phone connection.
   Without a signal, a half-loaded card just looks broken and people click
   away instead of waiting a second.

   It is deliberately indeterminate: none of these sources report progress
   (an <img> gives you "not yet" then "done", nothing in between), so a
   percentage would be a lie. A travelling sliver reads as "working" without
   claiming to know how far along it is. */

export function LoadBar({ label }) {
  return (
    <span className="loadbar" role="status" aria-label={label || "Loading"}>
      <span className="loadbar__run" />
    </span>
  );
}

/* An <img> that shows the bar until the file actually arrives.

   `onError` clears it too — a broken image should not sit there implying it
   is still on its way forever. */
export function LoadingImage({ src, alt, className, style, ...rest }) {
  const [done, setDone] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onLoad={() => setDone(true)}
        onError={() => setDone(true)}
        {...rest}
      />
      {!done && <LoadBar label={alt ? `Loading ${alt}` : "Loading"} />}
    </>
  );
}

export default LoadBar;
