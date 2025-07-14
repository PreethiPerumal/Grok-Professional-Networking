import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-main rounded-2xl shadow-xl border border-gray-200 dark:border-[#232946] overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-accent focus-within:shadow-2xl focus-within:border-accent ${className}`} tabIndex={0}>
    {children}
  </div>
);

export default Card; 