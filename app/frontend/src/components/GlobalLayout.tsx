import React from 'react';
import { useTheme } from '../context/ThemeContext';

const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'light' ? 'purple' : 'light');

  return (
    <div className="min-h-screen w-full relative" style={{ background: 'var(--bg-main)' }}>
      {children}
      {/* Floating Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-glow-purple bg-[var(--bg-card)] border-4 border-[var(--accent)] hover:scale-110 transition-all theme-switcher-animate"
        title="Switch Theme"
        style={{ color: 'var(--accent)', fontSize: 28 }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default GlobalLayout; 