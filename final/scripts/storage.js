// localStorage helpers. Every read and write is wrapped in try...catch
// (storage can be blocked, for example in some private windows), and a
// corrupted saved value is removed so the page starts fresh.

const SAVED_KEY = "portfolio-hub-saved";
const FILTER_KEY = "portfolio-hub-filter";

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage is blocked: the choice still works for this visit
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // storage is blocked: nothing was stored to remove
  }
}

// Saved projects are stored as a JSON array of project ids.
export function getSavedIds() {
  const stored = read(SAVED_KEY);
  if (stored === null) return [];

  try {
    const ids = JSON.parse(stored);
    if (Array.isArray(ids) && ids.every(Number.isInteger)) return ids;
  } catch {
    // not valid JSON: reset below
  }
  remove(SAVED_KEY);
  return [];
}

export function setSavedIds(ids) {
  write(SAVED_KEY, JSON.stringify(ids));
}

export function getLastFilter() {
  return read(FILTER_KEY);
}

export function setLastFilter(value) {
  write(FILTER_KEY, value);
}
