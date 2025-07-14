import React from 'react';

const Loader: React.FC = () => (
  <div className="animate-pulse space-y-4 p-6 bg-main rounded-2xl shadow-xl border border-gray-200 dark:border-[#232946]">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
    <div className="flex space-x-2 mt-4">
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

export default Loader; 