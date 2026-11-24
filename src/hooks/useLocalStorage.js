import { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

// Simple React state hook synced with localStorage
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => loadFromStorage(key, initialValue));

  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);

  return [value, setValue];
};
