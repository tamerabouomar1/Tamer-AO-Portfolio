import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import VideoBackground from "./components/VideoBackground";
import Sidebar from "./components/Sidebar";
import MobileTabBar from "./components/MobileTabBar";
import { preloadAllImages } from "./lib/preloadImages";
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

  // Warm every project image into cache once the page is idle, so popups
  // and page switches open instantly. Skipped inside a preview — that route
  // has its own images to fetch and shouldn't compete with them.
  useEffect(() => {
    if (!isPreview) preloadAllImages();
  }, [isPreview]);

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
