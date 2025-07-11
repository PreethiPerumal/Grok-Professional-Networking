import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { ProfileImageUpload } from './ProfileImageUpload';
import type { Profile } from '../../types';

const Input = ({ label, error, ...props }: any) => (
  <div className="mb-4">
    <label className="block font-semibold text-gray-900 mb-2">{label}</label>
    <input 
      className={`w-full border-2 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
        error ? 'border-red-300' : 'border-gray-200'
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
      className={`w-full border-2 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
        error ? 'border-red-300' : 'border-gray-200'
      }`}
      {...props}
    />
    {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
  </div>
);

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading, error, updateProfile, uploadImage, clearError } = useProfile();
  
  const [formData, setFormData] = useState<Partial<Profile>>({
    username: '',
    email: '',
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

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        skills: profile.skills || '',
        work_experience: profile.work_experience || '',
        education: profile.education || '',
        contact_info: profile.contact_info || '',
      });
    }
  }, [profile]);

  const validate = (data: Partial<Profile>) => {
    const newErrors: Record<string, string> = {};
    if (data.username && data.username.length > 80) newErrors.username = 'Username must be 80 characters or less.';
    if (data.email && (!/^\S+@\S+\.\S+$/.test(data.email) || data.email.length > 120)) newErrors.email = 'Enter a valid email address (max 120 chars).';
    if (data.bio && data.bio.length > 1000) newErrors.bio = 'Bio must be 1000 characters or less.';
    if (data.skills && data.skills.length > 500) newErrors.skills = 'Skills must be 500 characters or less.';
    if (data.work_experience && data.work_experience.length > 2000) newErrors.work_experience = 'Work experience must be 2000 characters or less.';
    if (data.education && data.education.length > 1000) newErrors.education = 'Education must be 1000 characters or less.';
    if (data.contact_info && data.contact_info.length > 500) newErrors.contact_info = 'Contact info must be 500 characters or less.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validate({ [name]: formData[name as keyof Profile] });
    setErrors(prev => ({ ...prev, ...fieldErrors }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, email: true, bio: true, skills: true, work_experience: true, education: true, contact_info: true });
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setSubmitting(true);
    setSuccess(false);
    clearError();
    try {
      await updateProfile(formData);
      setSuccess(true);
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
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-main p-4">
      <div className="w-full max-w-3xl bg-main rounded-2xl shadow-xl overflow-hidden card-hover">
        {/* Gradient Header with Avatar */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 flex flex-col items-center relative">
          <div className="w-28 h-28 rounded-full bg-secondary border-4 border-blue-200 shadow-lg flex items-center justify-center text-5xl mb-4 overflow-hidden">
            {profile.image_url ? (
              <img src={`http://localhost:5000${profile.image_url}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span role="img" aria-label="profile pic">👤</span>
            )}
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">{profile.username}</h2>
          <div className="text-lg text-blue-100 mb-2">{profile.email}</div>
          <Link to="/profile" className="absolute top-6 right-8 bg-secondary text-accent font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition-all border border-blue-200">
            Cancel
          </Link>
        </div>

        {/* Profile Image Upload */}
        <div className="px-8 pt-8">
          <ProfileImageUpload
            currentImageUrl={profile.image_url}
            onImageUpload={handleImageUpload}
            loading={loading}
            error={error}
          />
        </div>

        {/* Error/Success Display */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border-b border-green-200 flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 text-sm">Profile updated successfully!</span>
          </div>
        )}

        {/* Edit Form */}
        <form className="p-8" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username && errors.username}
            placeholder="Enter your username"
            maxLength={80}
          />
          <Input
            label="Email (Gmail ID)"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            placeholder="Enter your Gmail address"
            maxLength={120}
          />
          <TextArea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.bio && errors.bio}
            placeholder="Tell us about yourself..."
            rows={3}
            maxLength={1000}
          />
          <Input
            label="Skills (comma separated)"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.skills && errors.skills}
            placeholder="e.g. React, Node.js, SQL"
            maxLength={500}
          />
          <TextArea
            label="Work Experience"
            name="work_experience"
            value={formData.work_experience}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.work_experience && errors.work_experience}
            placeholder="Describe your work experience..."
            rows={3}
            maxLength={2000}
          />
          <TextArea
            label="Education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.education && errors.education}
            placeholder="Your education background..."
            rows={2}
            maxLength={1000}
          />
          <TextArea
            label="Contact Information"
            name="contact_info"
            value={formData.contact_info}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.contact_info && errors.contact_info}
            placeholder="How can people reach you?"
            rows={2}
            maxLength={500}
          />
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit; 