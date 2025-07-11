import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  post_count: number;
}

interface Post {
  id: number;
  title: string;
  user_id: number;
}

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(await res.json());
      } else {
        setError('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/posts?page=1&per_page=100', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      } else {
        setError('Failed to fetch posts');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Delete this post?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts(posts => posts.filter(p => p.id !== postId));
      } else {
        setError('Failed to delete post');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        {loading ? <div>Loading...</div> : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Admin</th>
                <th className="p-2">Posts</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.is_admin ? 'Yes' : 'No'}</td>
                  <td className="p-2">{u.post_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Posts</h2>
        {loading ? <div>Loading...</div> : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">User ID</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.title}</td>
                  <td className="p-2">{p.user_id}</td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDeletePost(p.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 