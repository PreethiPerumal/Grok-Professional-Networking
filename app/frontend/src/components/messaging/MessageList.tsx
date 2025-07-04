import React from 'react';

const MessageList: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Messages</h2>
        {/* Messages will be listed here */}
        <div style={{ color: 'var(--text-main)' }}>
          Messages will be listed here.
        </div>
      </div>
    </div>
  );
};

export default MessageList; 