import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import VideoBackground from "./components/VideoBackground";
import Sidebar from "./components/Sidebar";
import MobileTabBar from "./components/MobileTabBar";
import { preloadRouteImages } from "./lib/preloadImages";
import usePageMeta, { PAGE_META } from "./lib/usePageMeta";
import { SERVICE_PAGES } from "./siteData";

import Home from "./pages/Home";
import Free from "./pages/Free";
import Projects from "./pages/Projects";
import Websites from "./pages/Websites";
import TemplatePreview from "./pages/TemplatePreview";
import Media from "./pages/Media";
import About from "./pages/About";
import Fitness from "./pages/Fitness";
import WorkWithMe from "./pages/WorkWithMe";
import ServicePage from "./pages/ServicePage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
      <VideoBackground />
      <ScrollToTop />
      <div className="app">
        <Sidebar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/free" element={<Free />} />
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
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>
      <MobileTabBar />
    </>
  );
}
