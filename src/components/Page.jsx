import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/** Wraps each route's content so it fades/slides on navigation (framer-motion). */
export default function Page({ children, className = "" }) {
  return (
    <motion.main
      className={"main " + className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.main>
  );
}

/** Reusable container variants for staggered card reveals inside a page. */
export const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const cardIn = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* ---------------------------------------------------------------------------
   Scroll reveal.

   Long pages — /fitness above all — cannot animate everything on load, or the
   visitor sees none of it. This is a plain IntersectionObserver feeding the
   ordinary `animate` prop rather than framer's `whileInView`, for one reason:
   with no observer available it SHOWS the content instead of hiding it. On a
   page whose whole job is to be read, "animation failed" must never be able to
   mean "blank below the fold".

   threshold stays 0 on purpose. It is a fraction of the element, so on a tall
   section any non-zero value asks for more pixels than the screen has and the
   callback never fires. The negative bottom margin is what delays the reveal.
   --------------------------------------------------------------------------- */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return { ref, initial: "hidden", animate: shown ? "show" : "hidden" };
}

/** A staggered group: children with `variants={cardIn}` come in one by one. */
export function RevealGroup({ className = "", children, ...rest }) {
  const r = useReveal();
  return (
    <motion.div className={className} variants={container} {...r} {...rest}>
      {children}
    </motion.div>
  );
}

/** A single element that lifts in on its own once it is scrolled to. */
export function RevealCard({ className = "", children, ...rest }) {
  const r = useReveal();
  return (
    <motion.div className={className} variants={cardIn} {...r} {...rest}>
      {children}
    </motion.div>
  );
}
