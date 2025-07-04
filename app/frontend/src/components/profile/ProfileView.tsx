import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const mockProfile = {
  avatar: '',
  name: 'Aatham Ansari',
  title: 'B.E - Electronics and Communication Engineering',
  location: 'Tirunelveli, Tamil Nadu, India',
  about:
    'Passionate Electronics and Communication Engineering graduate from Tirunelveli. Specialized in embedded systems and digital electronics. Seeking opportunities to apply my technical skills and contribute to innovative projects.',
  skills: [
    'Embedded Systems',
    'Digital Electronics',
    'VLSI Design',
    'PCB Design',
    'Microcontrollers',
    'C Programming',
  ],
  education: [
    {
      degree: 'B.E.- Electronics and Communication Engineering',
      school: 'Anna University',
      period: '2019 - 2023',
    },
    {
      degree: 'Higher Secondary Education',
      school: 'Tirunelveli Government Higher Secondary School',
      period: '2017 - 2019',
    },
  ],
  contact: {
    email: 'aatham.ansari@example.com',
    phone: '+91 98765 43210',
    location: 'Tirunelveli, Tamil Nadu',
  },
  languages: [
    { name: 'Tamil', level: 'Native' },
    { name: 'English', level: 'Professional' },
    { name: 'Hindi', level: 'Conversational' },
  ],
  connections: 200,
  mutual: 25,
};

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'purple' : 'light');
  };

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card flex flex-col md:flex-row items-center md:items-end mb-6 relative">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purpleAccent-500 to-purpleDark-700 flex items-center justify-center text-5xl mb-4 text-white shadow-glow-purple border-4 border-purpleAccent-400">
              <span role="img" aria-label="profile pic">👤</span>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>{mockProfile.name}</h2>
              <div className="text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>{mockProfile.title}</div>
              <div className="flex items-center justify-center md:justify-start" style={{ color: 'var(--accent)' }}>
                <span className="mr-1">📍</span>
                {mockProfile.location}
              </div>
            </div>
          </div>
          <Link to="/profile/edit" className="absolute top-4 right-4 btn-accent shadow-glow-purple">Edit Profile</Link>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left/Main Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* About */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>About</h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-main)' }}>{mockProfile.about}</p>
            </div>
            {/* Skills */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {mockProfile.skills.map(skill => (
                  <span key={skill} className="bg-purpleAccent-500/20 text-purpleAccent-400 px-4 py-2 rounded-full text-sm font-medium border border-purpleAccent-400/40 shadow-glow-purple">{skill}</span>
                ))}
              </div>
            </div>
            {/* Education */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Education</h3>
              <ul className="space-y-4">
                {mockProfile.education.map((edu, idx) => (
                  <li key={idx} className="border-l-4 border-purpleAccent-400 pl-4">
                    <div className="font-semibold" style={{ color: 'var(--text-main)' }}>{edu.degree}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{edu.school}</div>
                    <div className="text-xs" style={{ color: 'var(--accent)' }}>{edu.period}</div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Recent Activity */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Recent Activity</h3>
              <a href="#" className="text-purpleAccent-400 hover:text-purpleAccent-300 text-sm font-medium transition-colors">Show more activity</a>
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Contact Info */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center" style={{ color: 'var(--text-main)' }}>
                  <span className="mr-2">📧</span>
                  <span className="text-sm">{mockProfile.contact.email}</span>
                </div>
                <div className="flex items-center" style={{ color: 'var(--text-main)' }}>
                  <span className="mr-2">📞</span>
                  <span className="text-sm">{mockProfile.contact.phone}</span>
                </div>
                <div className="flex items-center" style={{ color: 'var(--text-main)' }}>
                  <span className="mr-2">📍</span>
                  <span className="text-sm">{mockProfile.contact.location}</span>
                </div>
              </div>
            </div>
            {/* Languages */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Languages</h3>
              <ul className="space-y-2">
                {mockProfile.languages.map(lang => (
                  <li key={lang.name} className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-main)' }}>{lang.name}</span>
                    <span className="text-xs bg-purpleAccent-500/10 px-2 py-1 rounded" style={{ color: 'var(--accent)' }}>{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Connections */}
            <div className="card">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--accent)' }}>Connections</h3>
              <div className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{mockProfile.connections}+</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Connections</div>
              <div className="mt-2 text-sm" style={{ color: 'var(--text-main)' }}>{mockProfile.mutual} <span style={{ color: 'var(--accent)' }}>Mutual</span></div>
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