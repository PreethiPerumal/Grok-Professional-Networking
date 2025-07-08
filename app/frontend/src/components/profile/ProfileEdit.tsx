import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useProfile } from '../../hooks/useProfile';
import { ProfileImageUpload } from './ProfileImageUpload';
import type { Profile } from '../../types';

const Input = ({ label, error, ...props }: any) => (
  <div className="mb-4">
    <label className="block font-semibold text-gray-900 mb-2">{label}</label>
    <input 
      className={`w-full border rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
        error ? 'border-red-300' : 'border-gray-300'
      }`}
      {...props} 
    />
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

const TextArea = ({ label, error, ...props }: any) => (
  <div className="mb-4">
    <label className="block font-semibold text-gray-900 mb-2">{label}</label>
    <textarea
      className={`w-full border rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
        error ? 'border-red-300' : 'border-gray-300'
      }`}
      {...props}
    />
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { profile, loading, error, updateProfile, uploadImage, clearError } = useProfile();
  
  const [formData, setFormData] = useState<Partial<Profile>>({
    bio: '',
    skills: '',
    work_experience: '',
    education: '',
    contact_info: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        skills: profile.skills || '',
        work_experience: profile.work_experience || '',
        education: profile.education || '',
        contact_info: profile.contact_info || '',
      });
    }
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'purple' : 'light');
  };

  const validate = (data: Partial<Profile>) => {
    const newErrors: Record<string, string> = {};
    
    if (data.bio && data.bio.length > 1000) {
      newErrors.bio = 'Bio must be 1000 characters or less.';
    }
    
    if (data.skills && data.skills.length > 500) {
      newErrors.skills = 'Skills must be 500 characters or less.';
    }
    
    if (data.work_experience && data.work_experience.length > 2000) {
      newErrors.work_experience = 'Work experience must be 2000 characters or less.';
    }
    
    if (data.education && data.education.length > 1000) {
      newErrors.education = 'Education must be 1000 characters or less.';
    }
    
    if (data.contact_info && data.contact_info.length > 500) {
      newErrors.contact_info = 'Contact info must be 500 characters or less.';
    }
    
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const fieldErrors = validate({ [name]: formData[name as keyof Profile] });
    setErrors(prev => ({ ...prev, ...fieldErrors }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      bio: true,
      skills: true,
      work_experience: true,
      education: true,
      contact_info: true,
    });
    
    // Validate all fields
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setSubmitting(true);
    setSuccess(false);
    clearError();
    
    try {
      await updateProfile(formData);
      setSuccess(true);
      // Automatically navigate to profile after 1 second
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      await uploadImage(file);
    } catch (err) {
      console.error('Failed to upload image:', err);
    }
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
            onClick={() => window.location.reload()}
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
          {/* Header Card */}
          <div className="card flex flex-col md:flex-row items-center md:items-end mb-6 relative">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center md:items-start w-full md:w-auto mb-6 md:mb-0">
              <ProfileImageUpload
                currentImageUrl={profile.image_url}
                onImageUpload={handleImageUpload}
                loading={loading}
                error={error}
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 md:ml-8 w-full md:w-auto">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
                  {profile.username}
                </h2>
                <p className="text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>
                  {profile.email}
                </p>
              </div>
            </div>
            
            {/* Back Button */}
            <Link to="/profile" className="absolute top-4 right-4 btn-accent-outline">
              Back to Profile
            </Link>
          </div>

          {/* Profile Edit Form */}
          <form className="card mb-4" onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--accent)' }}>
              Edit Profile Information
            </h3>

            <TextArea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={1000}
              error={touched.bio && errors.bio}
            />
            {formData.bio && (
              <div className="text-right text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {formData.bio.length}/1000
              </div>
            )}

            <TextArea
              label="Skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
              placeholder="List your skills (e.g., JavaScript, React, Python, etc.)"
              rows={3}
              maxLength={500}
              error={touched.skills && errors.skills}
            />
            {formData.skills && (
              <div className="text-right text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {formData.skills.length}/500
              </div>
            )}

            <TextArea
              label="Work Experience"
              name="work_experience"
              value={formData.work_experience}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
              placeholder="Describe your work experience..."
              rows={4}
              maxLength={2000}
              error={touched.work_experience && errors.work_experience}
            />
            {formData.work_experience && (
              <div className="text-right text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {formData.work_experience.length}/2000
              </div>
            )}

            <TextArea
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
              placeholder="List your educational background..."
              rows={3}
              maxLength={1000}
              error={touched.education && errors.education}
            />
            {formData.education && (
              <div className="text-right text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {formData.education.length}/1000
              </div>
            )}

            <TextArea
              label="Contact Information"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
              placeholder="Additional contact information (phone, website, etc.)"
              rows={2}
              maxLength={500}
              error={touched.contact_info && errors.contact_info}
            />
            {formData.contact_info && (
              <div className="text-right text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                {formData.contact_info.length}/500
              </div>
            )}

            {/* Global Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
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

            <button
              type="submit"
              className="btn-accent w-full mt-6"
              disabled={submitting}
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">✅ Profile updated successfully!</p>
                  </div>
                </div>
              </div>
            )}
          </form>
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

export default ProfileEdit; 