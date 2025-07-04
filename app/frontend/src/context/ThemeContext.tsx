import React, { createContext, useContext, useEffect, useState } from 'react';

const themes = {
  light: 'light',
  purple: 'purple',
};

const ThemeContext = createContext({
  theme: themes.light,
  setTheme: (theme: string) => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || themes.light;
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 