import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Notifications: React.FC = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    if (!token) return;
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    fetchNotifications();
  };

  useEffect(() => {
    if (open) fetchNotifications();
    // eslint-disable-next-line
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <button
        className="relative px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
        onClick={() => setOpen(o => !o)}
      >
        Notifications
        {notifications.some(n => !n.is_read) && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">•</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2 font-bold border-b">Notifications</div>
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-3 border-b last:border-b-0 ${n.is_read ? 'bg-gray-50' : 'bg-blue-50'} cursor-pointer`}
                onClick={() => markAsRead(n.id)}
              >
                <div>{n.message}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications; 