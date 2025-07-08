import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useProfile } from '../../hooks/useProfile';

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { profile, loading, error, refreshProfile } = useProfile();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'purple' : 'light');
  };

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:5000${url}`;
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-main)' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
            Profile not found
          </h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <button
            onClick={() => refreshProfile()}
            className="btn-accent"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-main)' }}>
      {/* Navigation Bar */}
      <nav className="bg-transparent shadow-none border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>Grok Professional</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/feed" className="btn-accent-outline">Feed</Link>
              <Link to="/posts" className="btn-accent-outline">Posts</Link>
              <Link to="/jobs" className="btn-accent-outline">Jobs</Link>
              <Link to="/messages" className="btn-accent-outline">Messages</Link>
              <Link to="/profile" className="btn-accent">Profile</Link>
              <button 
                onClick={handleLogout}
                className="btn-accent-outline border-red-400 text-red-400 hover:text-white hover:bg-red-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="card flex flex-col md:flex-row items-center md:items-end mb-6 relative">
            <div className="flex flex-col items-center md:items-start w-full md:w-auto">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purpleAccent-500 to-purpleDark-700 flex items-center justify-center text-5xl mb-4 text-white shadow-glow-purple border-4 border-purpleAccent-400 overflow-hidden">
                {profile.image_url ? (
                  <img 
                    src={getImageUrl(profile.image_url)!} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span role="img" aria-label="profile pic">👤</span>
                )}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
                  {profile.username}
                </h2>
                <div className="text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {profile.email}
                </div>
              </div>
            </div>
            <Link to="/profile/edit" className="absolute top-4 right-4 btn-accent shadow-glow-purple">
              Edit Profile
            </Link>
          </div>

          {/* Error Display */}
          {error && (
            <div className="card mb-6 p-4 bg-red-50 border border-red-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left/Main Column */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* About */}
              {profile.bio && (
                <div className="card">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>About</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--text-main)' }}>{profile.bio}</p>
                </div>
              )}

              {/* Skills */}
              {profile.skills && (
                <div className="card">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(',').map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-purpleAccent-500/20 text-purpleAccent-400 px-4 py-2 rounded-full text-sm font-medium border border-purpleAccent-400/40 shadow-glow-purple"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {profile.work_experience && (
                <div className="card">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Work Experience</h3>
                  <div className="prose max-w-none" style={{ color: 'var(--text-main)' }}>
                    {profile.work_experience.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {profile.education && (
                <div className="card">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Education</h3>
                  <div className="prose max-w-none" style={{ color: 'var(--text-main)' }}>
                    {profile.education.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="card">
                <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Recent Activity</h3>
                <a href="#" className="text-purpleAccent-400 hover:text-purpleAccent-300 text-sm font-medium transition-colors">
                  Show more activity
                </a>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Contact Info */}
              {profile.contact_info && (
                <div className="card">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Contact Information</h3>
                  <div className="prose max-w-none" style={{ color: 'var(--text-main)' }}>
                    {profile.contact_info.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Stats */}
              <div className="card">
                <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Profile Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-main)' }}>Member since</span>
                    <span className="text-sm" style={{ color: 'var(--accent)' }}>
                      {new Date().getFullYear()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-main)' }}>Profile views</span>
                    <span className="text-sm" style={{ color: 'var(--accent)' }}>0</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Quick Actions</h3>
                <div className="space-y-2">
                  <Link 
                    to="/profile/edit" 
                    className="block w-full text-center btn-accent-outline text-sm py-2"
                  >
                    Edit Profile
                  </Link>
                  <button 
                    onClick={refreshProfile}
                    className="block w-full text-center btn-accent-outline text-sm py-2"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-glow-purple bg-[var(--bg-card)] border-4 border-[var(--accent)] hover:scale-110 transition-all theme-switcher-animate"
        title="Switch Theme"
        style={{ color: 'var(--accent)', fontSize: 28 }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default ProfileView; 