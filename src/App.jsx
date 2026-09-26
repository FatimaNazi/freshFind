import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import { ModalProvider } from "./context/ModalContext";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AuthModal from "./components/AuthModal";
import ShareModal from "./components/ShareModal";
import NoteModal from "./components/NoteModal";

import Home from "./pages/Home";
import About from "./pages/About";
import Markets from "./pages/Markets";
import MarketDetail from "./pages/MarketDetail";
import Produce from "./pages/Produce";
import ProduceDetail from "./pages/ProduceDetail";
import Seasonal from "./pages/Seasonal";
import SeasonalDetail from "./pages/SeasonalDetail";
import Bookmarks from "./pages/Bookmarks";
import FindMarket from "./pages/FindMarket";
import Highlights from "./pages/Highlights";
import HowItWorks from "./pages/HowItWorks";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <ToastProvider>
      <ModalProvider>
        <ScrollToTop />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Markets Routes */}
          <Route path="/markets" element={<Markets />} />
          <Route path="/markets/:id" element={<MarketDetail />} />
          <Route path="/market-detail" element={<MarketDetail />} />

          {/* Produce Routes */}
          <Route path="/produce" element={<Produce />} />
          <Route path="/produce/:id" element={<ProduceDetail />} />
          <Route path="/produce-detail" element={<ProduceDetail />} />

          {/* Seasonal Routes */}
          <Route path="/seasonal" element={<Seasonal />} />
          <Route path="/seasonal/:id" element={<SeasonalDetail />} />
          <Route path="/seasonal-detail" element={<SeasonalDetail />} />

          {/* Tools & Guides */}
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/find-market" element={<FindMarket />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
        <Chatbot />
        <AuthModal />
        <ShareModal />
        <NoteModal />
      </ModalProvider>
    </ToastProvider>
  );
}
