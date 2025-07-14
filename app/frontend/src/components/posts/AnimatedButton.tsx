import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, icon, className = '', ...props }) => (
  <button
    className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 ${className}`}
    {...props}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

export default AnimatedButton; 