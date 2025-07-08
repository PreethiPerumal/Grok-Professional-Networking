import type { Profile, ProfileImageUpload } from '../../types';

const API_URL = 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<Profile> => {
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Upload profile image
  uploadProfileImage: async (file: File): Promise<ProfileImageUpload> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/profile/image`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Validate file before upload
  validateImageFile: (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.' 
      };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: 'File too large. Maximum size is 5MB.' 
      };
    }

    return { isValid: true };
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