import React from 'react';

const PostList: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>Posts</h2>
        {/* Posts will be listed here */}
        <p style={{ color: 'var(--text-main)' }}>Posts will be listed here.</p>
      </div>
    </div>
  );
};

export default PostList; 