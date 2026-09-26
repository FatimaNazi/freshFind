import React, { useState, useEffect } from "react";
import { useModals } from "../context/ModalContext";
import { useToast } from "./Toast";
import { getBookmarkNote, saveBookmarkNote, deleteBookmarkNote } from "../utils/storage";

export default function NoteModal() {
  const { noteData, closeNote } = useModals();
  const { addToast } = useToast();
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (noteData) {
      const existing = getBookmarkNote(noteData.type, noteData.id);
      setNoteText(existing);
    }
  }, [noteData]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && noteData) {
        closeNote();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [noteData, closeNote]);

  if (!noteData) return null;

  const { type, id, itemName, onSave } = noteData;

  const handleSave = () => {
    saveBookmarkNote(type, id, noteText);
    if (onSave) onSave(noteText.trim());
    closeNote();
    addToast("Personal note saved for this session!", "success");
  };

  const handleDelete = () => {
    deleteBookmarkNote(type, id);
    if (onSave) onSave("");
    closeNote();
    addToast("Personal note deleted.", "info");
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 1055 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeNote();
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-journal-text text-success me-2"></i>
              Personal Note
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeNote}
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="alert alert-info py-2 px-3 small d-flex align-items-center gap-2">
              <i className="bi bi-info-circle-fill"></i>
              <span>
                This note is stored for this <strong>browser session only</strong> and will not be saved permanently on any server.
              </span>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                {itemName || (type === "markets" ? "Market" : "Produce Item")}
              </label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="e.g. Visit Saturday morning before 10 AM, buy tomatoes and fresh mint..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
              >
                <i className="bi bi-trash3 me-1"></i>Delete Note
              </button>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={closeNote}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-green btn-sm"
                  onClick={handleSave}
                >
                  <i className="bi bi-check-lg me-1"></i>Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
