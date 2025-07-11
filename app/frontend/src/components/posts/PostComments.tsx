import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-mention/dist/quill.mention.css';
import '../../quillRegisterMention';

interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  parent_id: number | null;
  created_at: string;
  replies: Comment[];
}

interface PostCommentsProps {
  postId: number;
}

const PostComments: React.FC<PostCommentsProps> = ({ postId }) => {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setError('Error loading comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const handleAddComment = async (parentId: number | null = null) => {
    if (!token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: parentId ? replyContent : newComment,
          parent_id: parentId,
        }),
      });
      if (res.ok) {
        setNewComment('');
        setReplyContent('');
        setReplyTo(null);
        fetchComments();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const renderComments = (comments: Comment[], depth = 0) => (
    <ul className={depth === 0 ? '' : 'ml-6 border-l pl-4'}>
      {comments.map(comment => (
        <li key={comment.id} className="mb-2">
          <div className="bg-gray-50 rounded p-2">
            <div className="text-sm text-gray-700 mb-1">User {comment.user_id} • {new Date(comment.created_at).toLocaleString()}</div>
            <div>{comment.content}</div>
            {user && token && (
              <button
                className="text-xs text-blue-600 hover:underline mt-1"
                onClick={() => setReplyTo(comment.id)}
              >
                Reply
              </button>
            )}
            {replyTo === comment.id && (
              <div className="mt-2">
                <ReactQuill
                  value={replyContent}
                  onChange={setReplyContent}
                  theme="snow"
                  modules={quillModules}
                  placeholder="Write a reply..."
                />
                <div className="flex gap-2 mt-1">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={() => handleAddComment(comment.id)}
                    disabled={submitting || !replyContent.trim()}
                  >
                    {submitting ? 'Replying...' : 'Reply'}
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded text-xs"
                    onClick={() => { setReplyTo(null); setReplyContent(''); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      {loading ? (
        <div>Loading comments...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {renderComments(comments)}
          {user && token && (
            <div className="mt-4">
              <ReactQuill
                value={newComment}
                onChange={setNewComment}
                theme="snow"
                modules={quillModules}
                placeholder="Write a comment..."
              />
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => handleAddComment()}
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostComments; 