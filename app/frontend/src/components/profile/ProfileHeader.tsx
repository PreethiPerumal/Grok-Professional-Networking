import React from 'react';

// Mock user data
const mockUser = {
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  name: 'John Doe',
  title: 'Software Engineer',
  location: 'San Francisco, CA',
  social: {
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    github: 'https://github.com/johndoe',
  },
};

const ProfileHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start bg-main rounded-2xl shadow-xl border border-gray-200 dark:border-[#232946] p-8 mb-6 w-full card-hover transition-all duration-200">
      <div className="flex flex-col items-center md:items-start md:mr-8">
        <div className="w-28 h-28 rounded-full border-4 border-accent shadow-lg mb-4 flex items-center justify-center bg-white dark:bg-[#232946]">
          <img
            src={mockUser.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="flex-1 text-center md:text-left flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-1 text-main tracking-tight leading-tight">{mockUser.name}</h2>
        <p className="text-lg text-secondary mb-1 font-medium">{mockUser.title}</p>
        <p className="text-secondary mb-3 flex items-center justify-center md:justify-start">
          <span className="material-icons text-base mr-1 text-accent">location_on</span>
          {mockUser.location}
        </p>
        <div className="flex justify-center md:justify-start space-x-4 mt-2">
          <a href={mockUser.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-accent hover:text-accent-dark" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62z"/></svg>
          </a>
          <a href={mockUser.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-accent hover:text-accent-dark" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482c-4.086-.205-7.713-2.164-10.141-5.144a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.396 0-.787-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636a10.025 10.025 0 0 0 2.457-2.548z"/></svg>
          </a>
          <a href={mockUser.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-secondary hover:text-black dark:hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.589 8.199-6.085 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 