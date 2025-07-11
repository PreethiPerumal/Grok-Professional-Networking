import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-mention/dist/quill.mention.css';
import '../../quillRegisterMention';

interface PostCreateProps {
  onPostCreated?: () => void;
}

const PostCreate: React.FC<PostCreateProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMedia(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setMedia(null);
      setPreviewUrl(null);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!content || content === '<p><br></p>') {
      setError('Post content is required.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tags', tags);
      formData.append('visibility', visibility);
      if (media) formData.append('media', media);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create post.');
      } else {
        setSuccess('Post created successfully!');
        setTitle('');
        setContent('');
        setTags('');
        setVisibility('public');
        setMedia(null);
        setPreviewUrl(null);
        setIsExpanded(false);
        if (onPostCreated) onPostCreated();
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-main">
      <div className="bg-main rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Create New Post
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-main mb-2">
              Post Title *
            </label>
            <input
              className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What's on your mind? Share your thoughts..."
              required
            />
          </div>

          {/* Content Editor */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-main mb-2">
              Content *
            </label>
            <div className="border-2 border-gray-200 dark:border-[#232946] rounded-lg overflow-hidden focus-within:border-accent focus-within:ring-2 focus-within:ring-accent focus-within:ring-opacity-20 transition-all duration-200">
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                theme="snow"
                modules={quillModules}
                formats={quillFormats}
                placeholder="Share your thoughts, ideas, or experiences..."
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>

          {/* Tags Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-main mb-2">
              Tags
            </label>
            <input
              className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. networking, jobs, advice, technology"
            />
            <p className="text-xs text-secondary mt-1">Separate tags with commas</p>
          </div>

          {/* Visibility and Media Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Visibility
              </label>
              <select
                className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200"
                value={visibility}
                onChange={e => setVisibility(e.target.value as 'public' | 'private')}
              >
                <option value="public">🌍 Public - Everyone can see</option>
                <option value="private">🔒 Private - Only you can see</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-main mb-2">
                Media (Image/Video)
              </label>
              <div className="relative flex items-center gap-3">
                {/* Hidden native file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
                {/* Custom themed button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white font-bold shadow-lg border-2 border-blue-700 hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
                >
                  Choose File
                </button>
                {/* Show selected file name */}
                <span className="text-main text-sm truncate max-w-[150px]">
                  {media ? media.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          {/* Media Preview */}
          {previewUrl && media && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-main mb-2">
                Media Preview
              </label>
              <div className="border-2 border-gray-200 dark:border-[#232946] rounded-lg p-4 bg-secondary">
                {media.type.startsWith('image') ? (
                  <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                ) : (
                  <video src={previewUrl} controls className="max-h-48 rounded-lg mx-auto" />
                )}
                <p className="text-xs text-secondary mt-2 text-center">{media.name}</p>
              </div>
            </div>
          )}

          {/* Post Preview */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-main mb-2">
              Preview
            </label>
            <div className="border-2 border-gray-200 dark:border-[#232946] rounded-lg p-4 bg-secondary">
              <h3 className="font-bold text-lg mb-2 text-main">
                {title || 'Your Post Title'}
              </h3>
              <div 
                className="text-main mb-3"
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400 italic">Your post content will appear here...</p>' }} 
              />
              {tags && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.split(',').map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-accent bg-opacity-10 text-accent rounded-full text-xs">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-sm text-secondary flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  visibility === 'public' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                }`}>
                  {visibility === 'public' ? '🌍 Public' : '🔒 Private'}
                </span>
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700">{success}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Post...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreate; 