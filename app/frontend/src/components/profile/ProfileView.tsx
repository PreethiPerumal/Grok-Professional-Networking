import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../context/ThemeContext';
import { profileApi } from './api';
import PostCreate from '../posts/PostCreate';

const mockStats = {
  connections: 320,
  mutualConnections: 12,
  posts: 18,
  endorsements: 42,
};

const mockSocial = {
  linkedin: 'https://linkedin.com/in/example',
  github: 'https://github.com/example',
  twitter: 'https://twitter.com/example',
};

const Section: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean}> = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 bg-white rounded-xl shadow p-6">
      <button
        className="w-full flex justify-between items-center font-semibold text-lg py-2 px-3 bg-gray-50 rounded hover:bg-gray-100 md:cursor-default md:bg-transparent md:hover:bg-transparent focus:outline-none"
        onClick={() => setOpen(!open)}
        type="button"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">{icon}{title}</span>
        <span className="ml-2 md:hidden">{open ? '-' : '+'}</span>
      </button>
      <div className={`mt-2 transition-all duration-300 ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>{children}</div>
    </div>
  );
};

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading, error, refreshProfile, uploadImage } = useProfile();
  const { theme, setTheme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const toggleTheme = () => setTheme(theme === 'light' ? 'purple' : 'light');

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5000${url}`;
  };

  // Avatar upload logic
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadError(null);
      setUploading(true);
      const file = e.target.files[0];
      const validation = profileApi.validateImageFile(file);
      if (!validation.isValid) {
        setUploadError(validation.error || 'Invalid file');
        setUploading(false);
        return;
      }
      try {
        await uploadImage(file);
      } catch (err) {
        setUploadError('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Profile not found
          </h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <button
            onClick={() => refreshProfile()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-main p-4 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-secondary border-2 border-blue-500 hover:scale-110 transition-all duration-200 hover:shadow-xl"
        title="Toggle theme"
      >
        <span
          className="text-accent"
          style={{ fontSize: 28 }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
      </button>
      {/* Floating FAB */}
      <button
        className="fixed bottom-28 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl flex items-center justify-center text-4xl hover:scale-110 hover:shadow-2xl transition-all duration-200 border-4 border-white"
        title="Quick Add"
        onClick={() => setShowPostModal(true)}
      >
        +
      </button>
      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-main rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowPostModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <PostCreate onPostCreated={() => setShowPostModal(false)} />
          </div>
        </div>
      )}
      <div className="w-full max-w-4xl rounded-2xl shadow-xl overflow-visible card-hover bg-main relative">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative rounded-t-2xl">
          {/* Floating Edit Button */}
          <Link to="/profile/edit" className="absolute right-8 top-8 z-30 bg-secondary text-accent font-semibold px-4 py-2 rounded-full shadow hover:bg-blue-50 transition-all border border-blue-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" /></svg>
            Edit Profile
          </Link>
        </div>
        {/* Profile Image - overlapping banner */}
        <div className="flex justify-center absolute left-0 right-0" style={{ top: '120px' }}>
          <div className="group">
            <div className="w-40 h-40 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden relative cursor-pointer group-hover:ring-4 group-hover:ring-blue-200 transition-all" onClick={handleAvatarClick} title="Change profile image" style={{ marginTop: 0 }}>
              {profile.image_url ? (
                <img src={getImageUrl(profile.image_url)!} alt="Profile" className={`w-full h-full object-cover ${uploading ? 'opacity-60' : ''}`} />
              ) : (
                <span role="img" aria-label="profile pic" className="text-7xl text-gray-400">👤</span>
              )}
              {/* Camera overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m6 0l-4.553-2.276A2 2 0 014 6.382V5a2 2 0 012-2h12a2 2 0 012 2v1.382a2 2 0 01-.447 1.342L15 10z" />
                </svg>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileInput}
                className="hidden"
                disabled={uploading}
              />
            </div>
            {uploadError && <div className="text-xs text-red-500 mt-2 text-center w-36">{uploadError}</div>}
          </div>
        </div>
        {/* User Info Row */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-28 px-8 pb-2">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">{profile.username}</h2>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <span className="text-lg">Software Engineer</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="flex items-center gap-1"><svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z" /></svg>Chennai, India</span>
            </div>
            <div className="flex gap-3 mt-2">
              <a href={mockSocial.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg className="w-6 h-6 text-blue-700 hover:text-blue-900" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62z"/></svg></a>
              <a href={mockSocial.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg className="w-6 h-6 text-gray-800 hover:text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.589 8.199-6.085 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
              <a href={mockSocial.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><svg className="w-6 h-6 text-blue-400 hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.025 10.025 0 0 0 2.457-2.548z"/></svg></a>
            </div>
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            {/* Stats Bar */}
            <div className="flex gap-8 bg-white rounded-xl shadow px-6 py-3 items-center">
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-blue-700">{mockStats.connections}</span>
                <span className="text-xs text-gray-500">Connections</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-purple-700">{mockStats.mutualConnections}</span>
                <span className="text-xs text-gray-500">Mutual</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-blue-700">{mockStats.posts}</span>
                <span className="text-xs text-gray-500">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg text-purple-700">{mockStats.endorsements}</span>
                <span className="text-xs text-gray-500">Endorsements</span>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Sections */}
        <div className="mt-8 px-4 md:px-8 pb-10">
          <Section title="About" icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6" /></svg>}>
            <div className="text-gray-700 text-base">{profile.bio || 'No bio provided.'}</div>
          </Section>
          <Section title="Skills" icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21l-1.5-4H3l3.75-3.25L5.5 9l3.5 2.75L12 7l3 4.75L19.5 9l-1.25 4.75L21 17h-4.5l-1.5 4-0.75-4z" /></svg>}>
            <div className="flex flex-wrap gap-2">
              {profile.skills ? profile.skills.split(',').map((skill, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{skill.trim()}</span>
              )) : <span className="text-gray-400">No skills listed.</span>}
            </div>
          </Section>
          <Section title="Work Experience" icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17v-2a2 2 0 012-2h6a2 2 0 012 2v2" /></svg>}>
            <div className="text-gray-700">
              {profile.work_experience ? profile.work_experience.split('\n').map((line, idx) => (
                <p key={idx} className="mb-2">{line}</p>
              )) : <span className="text-gray-400">No work experience listed.</span>}
            </div>
          </Section>
          <Section title="Education" icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 13.5c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5c0-.638.13-1.25.36-1.922L12 14z" /></svg>}>
            <div className="text-gray-700">
              {profile.education ? profile.education.split('\n').map((line, idx) => (
                <p key={idx} className="mb-2">{line}</p>
              )) : <span className="text-gray-400">No education listed.</span>}
            </div>
          </Section>
          <Section title="Contact Information" icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m0 0H9m3 0h3" /></svg>}>
            <div className="text-gray-700">
              {profile.contact_info ? profile.contact_info.split('\n').map((line, idx) => (
                <p key={idx} className="mb-2 text-sm">{line}</p>
              )) : <span className="text-gray-400">No contact info provided.</span>}
            </div>
          </Section>
          <Section title="Activity" icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" /></svg>}>
            <div className="text-gray-700">
              <div className="mb-2">Recent activity will appear here.</div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">Show more activity</button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ProfileView; 