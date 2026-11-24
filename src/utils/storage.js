// Safe localStorage helpers used across feature services and hooks

export const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode errors
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
};
