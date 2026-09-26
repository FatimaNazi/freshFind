// LocalStorage and SessionStorage Helpers for FreshFind
const BOOKMARK_KEYS = {
  markets: 'ff_bookmarked_markets',
  produce: 'ff_bookmarked_produce'
};

const SESSION_NOTES_KEY = 'ff_session_bookmark_notes';
const VISITOR_KEY = 'ff_visitor_count';

export function getBookmarks(type) {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEYS[type]);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isBookmarked(type, id) {
  return getBookmarks(type).indexOf(String(id)) !== -1;
}

export function toggleBookmark(type, id) {
  id = String(id);
  const list = getBookmarks(type);
  const index = list.indexOf(id);
  let nowSaved = false;

  if (index === -1) {
    list.push(id);
    nowSaved = true;
  } else {
    list.splice(index, 1);
    nowSaved = false;
  }

  localStorage.setItem(BOOKMARK_KEYS[type], JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('bookmarks:changed', { detail: { type, id, saved: nowSaved } }));
  return nowSaved;
}

export function getBookmarkNotes() {
  try {
    const raw = sessionStorage.getItem(SESSION_NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function getBookmarkNote(type, id) {
  const notes = getBookmarkNotes();
  return notes[`${type}:${id}`] || '';
}

export function saveBookmarkNote(type, id, note) {
  const notes = getBookmarkNotes();
  const key = `${type}:${id}`;
  if (!note || !note.trim()) {
    delete notes[key];
  } else {
    notes[key] = note.trim();
  }
  sessionStorage.setItem(SESSION_NOTES_KEY, JSON.stringify(notes));
  window.dispatchEvent(new CustomEvent('bookmarks:notesChanged', { detail: { type, id, note: notes[key] || '' } }));
}

export function deleteBookmarkNote(type, id) {
  saveBookmarkNote(type, id, '');
}

export function getVisitorCount() {
  let count = parseInt(localStorage.getItem(VISITOR_KEY), 10);
  if (isNaN(count)) count = 1250;
  return count;
}

export function incrementVisitorCount() {
  let count = getVisitorCount() + 1;
  localStorage.setItem(VISITOR_KEY, count);
  return count;
}
