import React from 'react';
import AnimatedButton from './AnimatedButton';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, className = '' }) => (
  <div className={`flex flex-col items-center justify-center p-8 bg-main rounded-2xl shadow-xl border border-red-200 dark:border-red-800 ${className}`}>
    <svg className="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-lg font-semibold text-red-600 mb-4">{message}</p>
    {onRetry && (
      <AnimatedButton onClick={onRetry} className="bg-red-500 hover:bg-red-600">
        Retry
      </AnimatedButton>
    )}
  </div>
);

export default ErrorState; 