import React, { useState, useEffect } from "react";
import { useModals } from "../context/ModalContext";
import { useToast } from "./Toast";

export default function ShareModal() {
  const { shareData, closeShare } = useModals();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [shareData]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && shareData) {
        closeShare();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shareData, closeShare]);

  if (!shareData) return null;

  const { title, text, url } = shareData;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        addToast("Link copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 3000);
      }).catch(() => {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const input = document.getElementById("shareUrlInputModal");
      if (input) {
        input.select();
        document.execCommand("copy");
        setCopied(true);
        addToast("Link copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      addToast("Failed to copy link.", "danger");
    }
  };

  const whatsappHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + "\n\n" + url)}`;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1055 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeShare();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-share text-success me-2"></i>
              Share Recommendation
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeShare}
            ></button>
          </div>
          <div className="modal-body p-4 text-center">
            <h6 className="fw-bold mb-1">{title}</h6>
            <p className="text-secondary small mb-4">{text}</p>

            <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-success px-3 py-2 d-flex flex-column align-items-center gap-1"
                style={{ minWidth: "75px" }}
              >
                <i className="bi bi-whatsapp fs-4"></i>
                <span className="small">WhatsApp</span>
              </a>
              <a
                href={facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary px-3 py-2 d-flex flex-column align-items-center gap-1"
                style={{ minWidth: "75px" }}
              >
                <i className="bi bi-facebook fs-4"></i>
                <span className="small">Facebook</span>
              </a>
              <a
                href={twitterHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-dark px-3 py-2 d-flex flex-column align-items-center gap-1"
                style={{ minWidth: "75px" }}
              >
                <i className="bi bi-twitter-x fs-4"></i>
                <span className="small">X (Twitter)</span>
              </a>
              <a
                href={emailHref}
                className="btn btn-outline-secondary px-3 py-2 d-flex flex-column align-items-center gap-1"
                style={{ minWidth: "75px" }}
              >
                <i className="bi bi-envelope-fill fs-4"></i>
                <span className="small">Email</span>
              </a>
            </div>

            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                id="shareUrlInputModal"
                value={url}
                readOnly
              />
              <button
                className="btn btn-green btn-sm px-3"
                type="button"
                onClick={handleCopy}
              >
                <i className="bi bi-clipboard me-1"></i>
                Copy Link
              </button>
            </div>
            {copied && (
              <div className="small text-success mt-2">
                <i className="bi bi-check2-circle me-1"></i>
                Link copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
