import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const GlobalLayout: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const toggleTheme = () => setTheme(theme === 'light' ? 'purple' : 'light');

  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full relative bg-main">
        <main>
          <Outlet />
        </main>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-secondary border-2 border-accent hover:scale-110 transition-all duration-200 hover:shadow-xl"
          title="Toggle theme"
        >
          <span
            className="text-accent"
            style={{ fontSize: 28 }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative bg-main">
      {/* Top Navigation Bar */}
      <nav className="bg-main border-b border-gray-200 dark:border-[#232946] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link to="/posts" className="text-2xl font-bold text-accent tracking-wide">
                GrokPro
              </Link>
            </div>

            {/* Center Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/posts" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/posts' 
                    ? 'text-accent bg-accent bg-opacity-10' 
                    : 'text-secondary hover:text-accent'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/profile" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/profile' 
                    ? 'text-accent bg-accent bg-opacity-10' 
                    : 'text-secondary hover:text-accent'
                }`}
              >
                Profile
              </Link>
              <Link 
                to="/jobs" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/jobs' 
                    ? 'text-accent bg-accent bg-opacity-10' 
                    : 'text-secondary hover:text-accent'
                }`}
              >
                Jobs
              </Link>
              <Link 
                to="/messages" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/messages' 
                    ? 'text-accent bg-accent bg-opacity-10' 
                    : 'text-secondary hover:text-accent'
                }`}
              >
                Messages
              </Link>
            </div>

            {/* Right Side - User Profile & Theme Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary border border-gray-200 dark:border-[#232946] hover:bg-gray-100 dark:hover:bg-[#232946] transition-colors"
                title="Toggle theme"
              >
                <span className="text-accent text-lg">
                  {theme === 'light' ? '🌙' : '☀️'}
                </span>
              </button>
              
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-main">{user.name || 'User'}</p>
                    <p className="text-xs text-secondary">User ID: {user.id}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1 text-sm text-secondary hover:text-accent transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-main rounded-2xl shadow-xl border border-gray-200 dark:border-[#232946] p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-main mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/posts/create" 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-accent bg-opacity-10 text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Create Post</span>
                </Link>
                <Link 
                  to="/profile/edit" 
                  className="flex items-center space-x-3 p-3 rounded-lg text-secondary hover:bg-secondary transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-6">
            <main>
              <Outlet />
            </main>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-main rounded-2xl shadow-xl border border-gray-200 dark:border-[#232946] p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-main mb-4">Suggestions</h3>
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-medium text-main mb-2">Trending Topics</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-secondary">#Networking</div>
                    <div className="text-sm text-secondary">#CareerGrowth</div>
                    <div className="text-sm text-secondary">#ProfessionalTips</div>
                  </div>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-medium text-main mb-2">Recent Activity</h4>
                  <div className="text-sm text-secondary">
                    No recent activity to show.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLayout; 