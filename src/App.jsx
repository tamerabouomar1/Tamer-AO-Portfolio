import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import VideoBackground from "./components/VideoBackground";
import Sidebar from "./components/Sidebar";
import MobileTabBar from "./components/MobileTabBar";
import ChatWidget from "./components/ChatWidget";
import { preloadAllImages } from "./lib/preloadImages";
import usePageMeta, { PAGE_META } from "./lib/usePageMeta";

import Home from "./pages/Home";
import Free from "./pages/Free";
import Projects from "./pages/Projects";
import Websites from "./pages/Websites";
import TemplatePreview from "./pages/TemplatePreview";
import Media from "./pages/Media";
import About from "./pages/About";
import Fitness from "./pages/Fitness";
import WorkWithMe from "./pages/WorkWithMe";

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
        {/* Rendered, but hidden. The assistant has to stay mounted across this
            route rather than be dropped from the tree: its launcher lives in a
            portal on <body> that React cannot take back, so leaving it out
            here would leave the bubble sitting on top of the preview. */}
        <ChatWidget hidden />
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
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>
      <MobileTabBar />
      {/* Outside .app on purpose. The mobile header carries
          `transform: translateZ(0)`, and a transformed ancestor becomes the
          containing block for position:fixed descendants — the launcher would
          anchor to the header instead of the viewport. It is also deliberately
          absent from the template-preview branch above: a chat bubble over a
          preview would appear to belong to the template being sold. */}
      <ChatWidget />
    </>
  );
}
