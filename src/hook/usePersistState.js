import { useState, useEffect } from 'react';

export default function usePersistState(key, initialValue) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    try {
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (state === null) {
      localStorage.removeItem(key);
    } else {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error saving key "${key}" to localStorage:`, error);
      }
    }
  }, [key, state]);

  return [state, setState];
}
