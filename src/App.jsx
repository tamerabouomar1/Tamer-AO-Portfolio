import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import VideoBackground from "./components/VideoBackground";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Media from "./pages/Media";
import About from "./pages/About";
import Fitness from "./pages/Fitness";
import Fund from "./pages/Fund";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <VideoBackground />
      <ScrollToTop />
      <div className="app">
        <Sidebar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/media" element={<Media />} />
            <Route path="/about" element={<About />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/fund" element={<Fund />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}
