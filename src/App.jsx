import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import VideoBackground from "./components/VideoBackground";
import Sidebar from "./components/Sidebar";
import MobileTabBar from "./components/MobileTabBar";
import { preloadRouteImages } from "./lib/preloadImages";
import usePageMeta, { PAGE_META } from "./lib/usePageMeta";
import { SERVICE_PAGES } from "./siteData";
import { LEGAL_PAGES } from "./legalData";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Websites from "./pages/Websites";
import TemplatePreview from "./pages/TemplatePreview";
import Media from "./pages/Media";
import About from "./pages/About";
import Fitness from "./pages/Fitness";
import WorkWithMe from "./pages/WorkWithMe";
import ServicePage from "./pages/ServicePage";
import Legal from "./pages/Legal";

/* New page: start at the top. New page with a #hash (the /media card's
   "/work-with-me#online-presence", the /free redirect to "#free"): go to that
   section instead. This used to scroll to the top unconditionally, so every
   deep link landed on the page header. The new page only mounts after the old
   one has animated out, so the target is looked for every 100ms for up to
   two seconds rather than once. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 20) clearInterval(timer);
      // a hidden tab does not animate a smooth scroll, so it jumps there instead
      if (el) el.scrollIntoView({ behavior: document.hidden ? "auto" : "smooth", block: "start" });
    }, 100);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();

  // A template preview takes over the whole screen: no sidebar, no tab bar
  // and no video background, so the site being previewed is seen exactly as
  // its own visitors would see it.
  const isPreview = !!matchPath("/templates/:slug", location.pathname);

  // Title and description for whichever route is showing. Unknown paths fall
  // back to the home entry, which matches the catch-all route rendering Home.
  // A preview sets its own title from the template it is showing, so this
  // leaves those alone.
  const meta = PAGE_META[location.pathname] || PAGE_META["/"];
  usePageMeta(
    isPreview ? null : meta.title,
    isPreview ? null : meta.description,
    isPreview ? null : location.pathname
  );

  /* The coaching page is a light page. It is not the portfolio: it sells a
     different thing to a different person, so the WHOLE shell goes white with
     it — sidebar, tab bar, backdrop and all — rather than a white column
     floating inside a black frame. The switch is one attribute on <html>, and
     every light rule in index.css hangs off :root[data-theme="fit"], so no
     component knows anything about it. */
  const isFit = location.pathname === "/fitness";
  useEffect(() => {
    const root = document.documentElement;
    if (isFit) root.setAttribute("data-theme", "fit");
    else root.removeAttribute("data-theme");
    return () => root.removeAttribute("data-theme");
  }, [isFit]);

  // Warm only the images THIS route shows, once it is idle. Re-runs on
  // navigation, and each route is warmed at most once. Skipped inside a
  // preview — that route has its own images and shouldn't compete with them.
  useEffect(() => {
    if (!isPreview) preloadRouteImages(location.pathname);
  }, [isPreview, location.pathname]);

  if (isPreview) {
    return (
      <>
        <ScrollToTop />
        <Routes location={location}>
          <Route path="/templates/:slug" element={<TemplatePreview />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      {/* First thing in the tab order, before the sidebar's twelve links.
          See .skip-link in index.css for why. */}
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <VideoBackground />
      <ScrollToTop />
      <div className="app">
        <Sidebar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            {/* Start Free was merged into Services. The worker 301s /free too;
                this covers in-app navigation from an old link. */}
            <Route path="/free" element={<Navigate to={{ pathname: "/work-with-me", hash: "#free" }} replace />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/websites" element={<Websites />} />
            {/* The store is a section of Websites now, not its own page. */}
            <Route path="/templates" element={<Navigate to="/websites" replace />} />
            <Route path="/media" element={<Media />} />
            <Route path="/about" element={<About />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/work-with-me" element={<WorkWithMe />} />
            {/* The search-intent pages. One route per slug rather than a
                wildcard, so an unknown path still falls through to the
                catch-all below instead of rendering an empty service page. */}
            {SERVICE_PAGES.map((s) => (
              <Route key={s.slug} path={`/${s.slug}`} element={<ServicePage slug={s.slug} />} />
            ))}
            {/* Arabic versions, for any service page carrying an `ar` block.
                Each needs a PAGE_META entry too, or it is not prerendered and
                404s in production. */}
            {SERVICE_PAGES.filter((s) => s.ar).map((s) => (
              <Route key={`ar-${s.slug}`} path={`/ar/${s.slug}`} element={<ServicePage slug={s.slug} lang="ar" />} />
            ))}
            {/* Privacy, cookies, terms, refunds. Same one-route-per-slug shape
                as the service pages above, and for the same reason: an unknown
                path must fall through to the catch-all rather than render an
                empty policy, which is the one page on the site where showing
                nothing would actually be a problem. */}
            {LEGAL_PAGES.map((d) => (
              <Route key={d.slug} path={`/${d.slug}`} element={<Legal slug={d.slug} />} />
            ))}
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>
      <MobileTabBar />
    </>
  );
}
