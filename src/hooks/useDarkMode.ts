import { useState, useEffect } from 'react';
import { KEY_DARK_MODE } from '../constants/local-storage';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem(KEY_DARK_MODE);
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    
    // Then check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem(KEY_DARK_MODE, JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return { darkMode, toggleDarkMode };
};