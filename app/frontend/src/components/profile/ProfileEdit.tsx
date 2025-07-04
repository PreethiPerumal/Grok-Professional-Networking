import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const initialProfile = {
  username: 'johndoe',
  email: 'john.doe@email.com',
  bio: 'Passionate software engineer.',
  skills: ['JavaScript', 'React'],
  avatar: '',
};

type ProfileType = typeof initialProfile;
type TouchedType = { [K in keyof ProfileType]?: boolean };

type ErrorsType = { [K in keyof ProfileType]?: string };

const validate = (values: ProfileType) => {
  const errors: ErrorsType = {};
  if (!values.username) errors.username = 'Username is required.';
  if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errors.email = 'Valid email required.';
  if (values.bio.length > 160) errors.bio = 'Bio must be 160 characters or less.';
  if (values.skills.length === 0) errors.skills = 'At least one skill required.';
  return errors;
};

const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    <label className="block font-semibold text-gray-900 mb-2">{label}</label>
    <input 
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
      {...props} 
    />
  </div>
);

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [values, setValues] = useState<ProfileType>(initialProfile);
  const [touched, setTouched] = useState<TouchedType>({});
  const [errors, setErrors] = useState<ErrorsType>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'purple' : 'light');
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setAvatarFile(acceptedFiles[0]);
      setAvatarPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(validate({ ...values, [name]: value }));
  };

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(validate({ ...values, [name]: value }));
  };

  const handleBlurTextArea = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(t => ({ ...t, [name]: true }));
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newSkills = [...values.skills];
    newSkills[idx] = e.target.value;
    setValues(v => ({ ...v, skills: newSkills }));
    setTouched(t => ({ ...t, skills: true }));
    setErrors(validate({ ...values, skills: newSkills }));
  };

  const addSkill = () => {
    setValues(v => ({ ...v, skills: [...v.skills, ''] }));
  };

  const removeSkill = (idx: number) => {
    const newSkills = values.skills.filter((_, i) => i !== idx);
    setValues(v => ({ ...v, skills: newSkills }));
    setTouched(t => ({ ...t, skills: true }));
    setErrors(validate({ ...values, skills: newSkills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, email: true, bio: true, skills: true });
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    setSuccess(false);
    // Simulate upload
    if (avatarFile) {
      setUploading(true);
      await new Promise(res => setTimeout(res, 1200));
      setUploading(false);
    }
    await new Promise(res => setTimeout(res, 1000));
    setSubmitting(false);
    setSuccess(true);
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>Edit Profile</h2>
            <Link to="/profile" className="btn-accent-outline">Back to Profile</Link>
          </div>
        <form className="card mb-4" onSubmit={handleSubmit}>
      {/* Avatar Upload */}
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-purpleAccent-400 bg-purpleAccent-500/10' : 'border-purpleAccent-400 hover:border-purpleAccent-500'}`} style={{ background: 'var(--bg-card)' }}>
        <input {...getInputProps()} />
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar Preview" className="mx-auto w-24 h-24 rounded-full mb-3 shadow-glow-purple border-4 border-purpleAccent-400" />
        ) : (
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-purpleAccent-500 to-purpleDark-700 flex items-center justify-center text-3xl text-white shadow-glow-purple border-4 border-purpleAccent-400">
            👤
          </div>
        )}
        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Drag & drop an image, or click to select</p>
        <p className="text-xs" style={{ color: 'var(--accent)' }}>Supports: JPG, PNG, GIF (max 5MB)</p>
        {uploading && <div className="mt-3 font-medium" style={{ color: 'var(--accent)' }}>Uploading...</div>}
      </div>
      <Input
        label="Username"
        name="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleChange}
        disabled={submitting}
        placeholder="Enter your username"
        className="input-theme"
      />
      {touched.username && errors.username && <div className="text-red-500 text-sm mb-3 -mt-2">{errors.username}</div>}
      <Input
        label="Email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleChange}
        disabled={submitting}
        type="email"
        placeholder="Enter your email address"
        className="input-theme"
      />
      {touched.email && errors.email && <div className="text-red-500 text-sm mb-3 -mt-2">{errors.email}</div>}
      <div className="mb-6">
        <label className="block font-semibold mb-2" style={{ color: 'var(--accent)' }}>Bio</label>
        <textarea
          name="bio"
          value={values.bio}
          onChange={handleChangeTextArea}
          onBlur={handleBlurTextArea}
          className="input-theme resize-none"
          maxLength={160}
          disabled={submitting}
          placeholder="Tell us about yourself..."
          rows={4}
        />
        <div className="text-right text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{values.bio.length}/160</div>
        {touched.bio && errors.bio && <div className="text-red-500 text-sm mb-3 -mt-2">{errors.bio}</div>}
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-3" style={{ color: 'var(--accent)' }}>Skills</label>
        {values.skills.map((skill, idx) => (
          <div key={idx} className="flex items-center mb-3">
            <input
              className="input-theme flex-1"
              value={skill}
              onChange={e => handleSkillChange(e, idx)}
              disabled={submitting}
              placeholder="Enter a skill"
            />
            <button 
              type="button" 
              className="ml-3 text-red-400 hover:text-white hover:bg-red-400 p-2 rounded-full transition-colors" 
              onClick={() => removeSkill(idx)} 
              disabled={submitting}
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          type="button" 
          className="btn-accent mt-2" 
          onClick={addSkill} 
          disabled={submitting}
        >
          + Add Skill
        </button>
        {touched.skills && errors.skills && <div className="text-red-500 text-sm mt-3">{errors.skills}</div>}
      </div>
      <button
        type="submit"
        className="btn-accent w-full mt-2"
        disabled={submitting}
      >
        {submitting ? 'Saving Changes...' : 'Save Changes'}
      </button>
      {success && <div className="mt-4 text-green-400 text-center font-medium">✅ Profile updated successfully!</div>}
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