import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  // Auth Modal State: null | 'login' | 'signup'
  const [authMode, setAuthMode] = useState(null);

  // Share Modal State: null | { title, text, url }
  const [shareData, setShareData] = useState(null);

  // Note Modal State: null | { type, id, itemName, note, onSave }
  const [noteData, setNoteData] = useState(null);

  const openAuth = (mode = "signup") => setAuthMode(mode);
  const closeAuth = () => setAuthMode(null);

  const openShare = (title, text, url) => {
    const fullUrl = url ? new URL(url, window.location.href).href : window.location.href;
    if (navigator.share) {
      navigator.share({
        title: title || "FreshFind",
        text: text || "Check this out on FreshFind!",
        url: fullUrl
      }).catch((err) => {
        if (err.name !== "AbortError") {
          setShareData({
            title: title || "FreshFind Recommendation",
            text: text || "Check out this recommendation on FreshFind!",
            url: fullUrl
          });
        }
      });
    } else {
      setShareData({
        title: title || "FreshFind Recommendation",
        text: text || "Check out this recommendation on FreshFind!",
        url: fullUrl
      });
    }
  };

  const closeShare = () => setShareData(null);

  const openNote = (type, id, itemName, onSave) => {
    setNoteData({ type, id, itemName, onSave });
  };

  const closeNote = () => setNoteData(null);

  return (
    <ModalContext.Provider
      value={{
        authMode,
        openAuth,
        closeAuth,
        setAuthMode,
        shareData,
        openShare,
        closeShare,
        noteData,
        openNote,
        closeNote
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
}
