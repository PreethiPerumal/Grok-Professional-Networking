import React, { useState } from 'react';

const mockActivity = {
  connections: 320,
  mutualConnections: 12,
  timeline: [
    { type: 'post', content: 'Shared a new article on React best practices.', date: '2024-06-01' },
    { type: 'connection', content: 'Connected with Jane Smith.', date: '2024-05-28' },
    { type: 'comment', content: 'Commented on a post about TypeScript.', date: '2024-05-25' },
    { type: 'post', content: 'Posted about a new job opportunity.', date: '2024-05-20' },
    { type: 'like', content: 'Liked a post on Python tips.', date: '2024-05-18' },
    { type: 'post', content: 'Shared a project update.', date: '2024-05-15' },
    { type: 'connection', content: 'Connected with Alex Johnson.', date: '2024-05-10' },
    { type: 'comment', content: 'Commented on a JavaScript article.', date: '2024-05-08' },
    { type: 'like', content: 'Liked a post on web security.', date: '2024-05-05' },
    { type: 'post', content: 'Published a blog on frontend frameworks.', date: '2024-05-01' },
  ]
};

const PAGE_SIZE = 4;

const ProfileActivity: React.FC = () => {
  const [page, setPage] = useState(1);
  const total = mockActivity.timeline.length;
  const visible = mockActivity.timeline.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < total;

  return (
    <div className="bg-main shadow rounded-lg p-6 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="text-main">
          <span className="font-bold text-lg">Connections:</span> {mockActivity.connections}
          <span className="ml-4 font-bold text-lg">Mutual:</span> {mockActivity.mutualConnections}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-md mb-2 text-main">Activity Timeline</h3>
        <ul>
          {visible.map((item, idx) => (
            <li key={idx} className="mb-2 border-l-4 pl-2 border-blue-200">
              <span className="text-secondary text-xs mr-2">{item.date}</span>
              <span className="font-medium text-main">{item.content}</span>
            </li>
          ))}
        </ul>
        {hasMore && (
          <button
            className="mt-2 px-4 py-1 bg-accent text-white rounded hover:bg-accent-dark"
            onClick={() => setPage(page + 1)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileActivity; 