const API_URL = 'http://localhost:5000';

export const profileApi = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  },

  updateProfile: async (profileData: any) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};

// Mock API for profile and activity

export const fetchProfile = async () => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  return {
    username: 'johndoe',
    email: 'john.doe@email.com',
    bio: 'Passionate software engineer with 7+ years of experience building scalable web applications.',
    skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python'],
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'Software Engineer',
    location: 'San Francisco, CA',
    social: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe',
    },
    experience: [
      {
        company: 'TechCorp',
        title: 'Senior Software Engineer',
        period: '2021 - Present',
        description: 'Leading a team of 5 to build cloud-native solutions.'
      },
      {
        company: 'Webify',
        title: 'Frontend Developer',
        period: '2018 - 2021',
        description: 'Developed and maintained the main customer portal.'
      }
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'M.S. Computer Science',
        period: '2016 - 2018'
      },
      {
        school: 'UCLA',
        degree: 'B.S. Computer Science',
        period: '2012 - 2016'
      }
    ],
    contact: {
      email: 'john.doe@email.com',
      phone: '+1 555-123-4567',
      website: 'https://johndoe.dev'
    }
  };
};

export const fetchActivity = async (page = 1, pageSize = 4) => {
  await new Promise(res => setTimeout(res, 400));
  const timeline = [
    { type: 'post', content: 'Shared a new article on React best practices.', date: '2024-06-01' },
    { type: 'connection', content: 'Connected with Jane Smith.', date: '2024-05-28' },
    { type: 'comment', content: 'Commented on a post about TypeScript.', date: '2024-05-25' },
    { type: 'post', content: 'Posted about a new job opportunity.', date: '2024-05-20' },
    { type: 'like', content: 'Liked a post on Python tips.', date: '2024-05-18' },
    { type: 'post', content: 'Shared a project update.', date: '2024-05-15' },
    { type: 'connection', content: 'Connected with Alex Johnson.', date: '2024-05-10' },
    { type: 'comment', content: 'Commented on a JavaScript article.', date: '2024-05-08' },
    { type: 'like', content: 'Liked a post on web security.', date: '2024-05-05' },
    { type: 'post', content: 'Published a blog on frontend frameworks.', date: '2024-05-01' },
  ];
  return {
    connections: 320,
    mutualConnections: 12,
    timeline: timeline.slice(0, page * pageSize),
    total: timeline.length
  };
}; 