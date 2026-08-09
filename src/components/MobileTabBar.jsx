import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon, TAB_ITEMS, MORE_ITEMS } from "./navItems";
import useSwipe from "./useSwipe";

/**
 * Mobile-only bottom navigation (hidden at >760px by CSS).
 *
 * Four permanent tabs — Home, Projects, Websites, Fitness — so the audiences
 * people actually arrive for are one thumb-tap away without opening anything.
 * The remaining pages sit in a "More" sheet, with Work With Me pulled to the
 * top as the primary action.
 */
export default function MobileTabBar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();

  // A bottom sheet on iOS is dismissed by flicking it down. Escape and a tap
  // on the backdrop already closed it; this is the gesture people try first.
  const sheetSwipe = useSwipe({ onDown: () => setMoreOpen(false) });

  // never leave the sheet open across a navigation
  useEffect(() => setMoreOpen(false), [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const moreActive = MORE_ITEMS.some((m) => m.to === pathname);

  return (
    <>
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              className="tabbar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="tabsheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              role="dialog"
              aria-label="More pages"
              {...sheetSwipe}
            >
              <span className="tabsheet__grip" aria-hidden="true" />
              {MORE_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    "tabsheet__item" +
                    (isActive ? " is-active" : "") +
                    (item.to === "/work-with-me" ? " tabsheet__item--primary" : "")
                  }
                  onClick={() => setMoreOpen(false)}
                >
                  <span className="tabsheet__icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="tabbar" aria-label="Primary">
        {TAB_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => "tab" + (isActive ? " is-active" : "")}
          >
            <span className="tab__icon">{item.icon}</span>
            <span className="tab__label">{item.short}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className={"tab tab--more" + (moreOpen || moreActive ? " is-active" : "")}
          onClick={() => setMoreOpen((o) => !o)}
          aria-expanded={moreOpen}
          aria-label="More pages"
        >
          <span className="tab__icon">{Icon.more}</span>
          <span className="tab__label">More</span>
        </button>
      </nav>
    </>
  );
}
