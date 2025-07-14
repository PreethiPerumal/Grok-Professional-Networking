import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PostComments from './PostComments';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation } from 'react-router-dom';
import PostCreate from './PostCreate';
import { useInfiniteQuery } from '@tanstack/react-query';
import Card from './Card';
import AnimatedButton from './AnimatedButton';
import Loader from './Loader';
import ErrorState from './ErrorState';

interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  tags: string;
  visibility: string;
  media_url: string | null;
  created_at: string;
  like_count: number;
  view_count: number;
  comment_count: number;
}

interface PostAnalytics {
  like_count: number;
  comment_count: number;
  view_count: number;
}

type PostListQueryKey = [string, { q: string; tag: string; visibility: string; category: string; sort: string }];

const fetchPosts = async ({ pageParam = 1, queryKey }: { pageParam?: number; queryKey: any }) => {
  const [_key, { q, tag, visibility, category, sort }] = queryKey;
  const params = new URLSearchParams({
    page: String(pageParam),
    per_page: '10',
    ...(q && { q }),
    ...(tag && { tag }),
    ...(visibility && { visibility }),
    ...(category && { category }),
    ...(sort && { sort }),
  });
  const res = await fetch(`/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

const PostList: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('');
  const [visibility, setVisibility] = useState('');
  const [likeLoading, setLikeLoading] = useState<number | null>(null);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editVisibility, setEditVisibility] = useState<'public' | 'private'>('public');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<{ [id: number]: PostAnalytics }>({});
  const location = useLocation();
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const {
    data,
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', { q, tag, visibility, category, sort }],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage: any) => {
      if (lastPage.page < lastPage.pages) return lastPage.page + 1;
      return undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    initialPageParam: 1,
  });

  // Infinite scroll logic
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (showCreate) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [showCreate]);

  const fetchAnalytics = async (postId: number) => {
    const res = await fetch(`/api/posts/${postId}`);
    if (res.ok) {
      const data = await res.json();
      setAnalytics(a => ({ ...a, [postId]: {
        like_count: data.like_count,
        comment_count: data.comment_count,
        view_count: data.view_count,
      }}));
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line
  }, [page, q, tag, visibility]);

  // Fetch analytics for all posts on posts change
  useEffect(() => {
    data?.pages.flatMap((p: any) => p.posts).forEach(post => {
      fetchAnalytics(post.id);
    });
    // eslint-disable-next-line
  }, [data]);

  const handleLike = async (postId: number) => {
    if (!token) return;
    setLikeLoading(postId);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        refetch();
      }
    } finally {
      setLikeLoading(null);
    }
  };

  const handleUnlike = async (postId: number) => {
    if (!token) return;
    setLikeLoading(postId);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        refetch();
      }
    } finally {
      setLikeLoading(null);
    }
  };

  const openEdit = (post: Post) => {
    setEditPost(post);
    setEditContent(post.content);
    setEditTitle(post.title);
    setEditTags(post.tags);
    setEditVisibility(post.visibility as 'public' | 'private');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPost || !token) return;
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('content', editContent);
      formData.append('tags', editTags);
      formData.append('visibility', editVisibility);
      const res = await fetch(`/api/posts/${editPost.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setEditPost(null);
        refetch();
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleteLoading(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        refetch();
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  function extractLinks(html: string): string[] {
    const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/g;
    return html.match(urlRegex) || [];
  }

  const getPostUrl = (postId: number) => {
    return `${window.location.origin}${location.pathname}#post-${postId}`;
  };

  const handleCopyLink = (postId: number) => {
    navigator.clipboard.writeText(getPostUrl(postId));
    alert('Link copied to clipboard!');
  };

  const handleShareTwitter = (post: Post) => {
    const url = encodeURIComponent(getPostUrl(post.id));
    const text = encodeURIComponent(post.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`,'_blank');
  };

  const TrendingPosts: React.FC = () => {
    const [trending, setTrending] = useState<Post[]>([]);
    useEffect(() => {
      fetch('/api/posts/trending')
        .then(res => res.json())
        .then(setTrending);
    }, []);
    if (!trending.length) return null;
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Trending Posts</h2>
        {trending.map(post => (
          <div key={post.id} className="bg-yellow-50 rounded-lg shadow p-4 mb-2">
            <h3 className="font-bold text-lg mb-1">{post.title}</h3>
            <div className="text-xs text-gray-600 mb-1">Views: {post.view_count} | Likes: {post.like_count} | Comments: {post.comment_count}</div>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        ))}
      </div>
    );
  };

  const AdvancedSearch: React.FC<{ onResults: (posts: Post[]) => void }> = ({ onResults }) => {
    const [userId, setUserId] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<{ id: number; username: string }[]>([]);

    useEffect(() => {
      fetch('/api/users').then(res => res.json()).then(setUsers);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);
      const res = await fetch(`/api/posts/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        onResults(data.posts);
      }
      setLoading(false);
    };

    return (
      <div className="bg-main rounded-2xl shadow-xl border border-gray-200 dark:border-[#232946] p-6 mb-6">
        <h3 className="text-lg font-semibold text-main mb-4">Advanced Search</h3>
        <form className="flex flex-wrap gap-4 items-end" onSubmit={handleSearch}>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-main mb-2">User</label>
            <select 
              className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200" 
              value={userId} 
              onChange={e => setUserId(e.target.value)}
            >
              <option value="">All users</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-main mb-2">Date From</label>
            <input 
              className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200" 
              type="date" 
              value={dateFrom} 
              onChange={e => setDateFrom(e.target.value)} 
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-main mb-2">Date To</label>
            <input 
              className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200" 
              type="date" 
              value={dateTo} 
              onChange={e => setDateTo(e.target.value)} 
            />
          </div>
          <div className="min-w-[120px]">
            <button 
              className="w-full bg-accent text-white px-4 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const handlePostCreated = () => {
    setShowCreate(false);
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-main">
      {/* LinkedIn-style "Start a post" box */}
      <Card className="mb-6">
        {!showCreate ? (
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <AnimatedButton
              onClick={() => setShowCreate(true)}
              className="flex-1 text-left p-4 rounded-xl border-2 border-gray-200 dark:border-[#232946] hover:border-accent transition-colors bg-secondary hover:bg-gray-50 dark:hover:bg-[#232946]"
            >
              <span className="text-secondary">Start a post...</span>
            </AnimatedButton>
          </div>
        ) : (
          <div className="bg-main rounded-xl shadow-lg border border-gray-200 dark:border-[#232946] overflow-hidden max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Creating New Post</h3>
              <AnimatedButton
                onClick={() => setShowCreate(false)}
                className="text-white hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </AnimatedButton>
            </div>
            <PostCreate onPostCreated={handlePostCreated} />
          </div>
        )}
      </Card>

      {/* Advanced Search */}
      <AdvancedSearch onResults={setSearchResults} />

      {/* Posts Feed */}
      <div className="space-y-6">
        {isFetching && !isFetchingNextPage ? (
          <Loader />
        ) : queryError ? (
          <ErrorState message={String(queryError)} onRetry={refetch} />
        ) : searchResults ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-main">Search Results</h2>
              <AnimatedButton
                onClick={() => setSearchResults(null)}
                className="text-accent hover:text-accent-dark transition-colors"
              >
                Clear Search
              </AnimatedButton>
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-secondary">No posts found matching your search criteria.</div>
            ) : (
              searchResults.map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} onUnlike={handleUnlike} />
              ))
            )}
          </div>
        ) : (
          data?.pages.flatMap((p: any) => p.posts).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-main mb-2">No posts yet</h3>
              <p className="text-secondary mb-4">Be the first to share something with your network!</p>
              <AnimatedButton
                onClick={() => setShowCreate(true)}
                className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
              >
                Create Your First Post
              </AnimatedButton>
            </div>
          ) : (
            <>
              {data?.pages.flatMap((p: any) => p.posts).map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} onUnlike={handleUnlike} />
              ))}
            </>
          )
        )}
      </div>

      {/* Pagination */}
      {hasNextPage && (
        <div className="flex justify-center space-x-2 mt-8">
          <AnimatedButton
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 rounded-lg bg-secondary text-main hover:bg-gray-200 dark:hover:bg-[#232946] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </AnimatedButton>
        </div>
      )}
      {/* Edit Modal */}
      {editPost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <AnimatedButton
              onClick={() => setEditPost(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </AnimatedButton>
            <h3 className="text-lg font-bold mb-4">Edit Post</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Title</label>
                <input
                  className="w-full border rounded p-2"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Content</label>
                <ReactQuill value={editContent} onChange={setEditContent} theme="snow" />
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Tags</label>
                <input
                  className="w-full border rounded p-2"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold mb-1">Visibility</label>
                <select
                  className="w-full border rounded p-2"
                  value={editVisibility}
                  onChange={e => setEditVisibility(e.target.value as 'public' | 'private')}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <AnimatedButton
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </AnimatedButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// LinkedIn-style Post Card Component
const PostCard: React.FC<{ post: Post; onLike: (id: number) => void; onUnlike: (id: number) => void }> = ({ post, onLike, onUnlike }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <Card className="bg-main rounded-2xl shadow-xl border border-gray-200 dark:border-[#232946] overflow-hidden">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100 dark:border-[#232946]">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {post.user_id.toString().charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-main text-lg mb-1">{post.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-secondary">
              <span>User {post.user_id}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{post.visibility}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        <div className="text-main leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        {/* Tags */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.split(',').map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-accent bg-opacity-10 text-accent rounded-full text-sm font-medium">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Media */}
        {post.media_url && (
          <div className="mb-4">
            {post.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img src={`http://localhost:5000${post.media_url}`} alt="Post media" className="w-full rounded-lg" />
            ) : (
              <video controls className="w-full rounded-lg">
                <source src={`http://localhost:5000${post.media_url}`} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-[#232946]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <AnimatedButton
              onClick={() => {
                if (liked) {
                  onUnlike(post.id);
                } else {
                  onLike(post.id);
                }
                setLiked(!liked);
              }}
              className="flex items-center space-x-2 text-secondary hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.like_count || 0} Likes</span>
            </AnimatedButton>
            <AnimatedButton
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-secondary hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comment_count || 0} Comments</span>
            </AnimatedButton>
          </div>
          <div className="text-sm text-secondary">
            {post.view_count || 0} views
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 dark:border-[#232946]">
          <PostComments postId={post.id} />
        </div>
      )}
    </Card>
  );
};

export default PostList; 