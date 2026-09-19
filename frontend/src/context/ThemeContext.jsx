import React, { createContext, useContext, useEffect, useState } from 'react';
import { lsGet, lsSet } from '../utils/storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => lsGet('norcet_theme', 'light'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    lsSet('norcet_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
