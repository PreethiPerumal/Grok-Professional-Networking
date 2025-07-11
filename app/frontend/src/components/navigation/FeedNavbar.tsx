import React from 'react';

const FeedNavbar: React.FC = () => {
  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold text-blue-700 tracking-wide">Feed</span>
          </div>
          {/* Add more navigation items here if needed */}
        </div>
      </div>
    </nav>
  );
};

export default FeedNavbar; 