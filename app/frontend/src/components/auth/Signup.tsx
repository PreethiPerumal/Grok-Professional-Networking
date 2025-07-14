import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './api';
import Card from '../posts/Card';
import AnimatedButton from '../posts/AnimatedButton';

const Signup: React.FC = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '' });
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; confirm_password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!form.confirm_password) newErrors.confirm_password = 'Please confirm your password';
    else if (form.password !== form.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await authApi.signup({ username: form.username, email: form.email, password: form.password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        setMessage('Signup successful! Redirecting...');
        setTimeout(() => navigate('/profile'), 1000);
      } else if (res.message) {
        setMessage(res.message + ' Please login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(res.error || 'Signup failed.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main p-4">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Banner/Brand */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-blue-500 w-1/2 p-10 text-white relative">
          <h2 className="text-2xl font-semibold mb-2">Join Us!</h2>
          <p className="text-blue-100 text-lg">Create your professional profile and grow your network.</p>
        </div>
        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <span className="block text-3xl font-extrabold tracking-tight text-main">Grok</span>
            <span className="block text-lg font-bold tracking-tight text-accent mt-1">Professional-Networking</span>
          </div>
          <h2 className="text-2xl font-bold text-main mb-2">Create your account</h2>
          <p className="text-gray-500 mb-6">Join the professional community</p>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200"
                placeholder="Enter your username"
              />
              {errors.username && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200"
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 011.563-2.037L1.311 8.093a1 1 0 011.327-.416l1.5 1a1 1 0 00.656.249H4.965a1 1 0 00.656-.249l1.5-1a1 1 0 011.327.416l.689 1.378M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm1.5 0a5.25 5.25 0 10-10.5 0 5.25 5.25 0 0010.5 0z" />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 011.563-2.037L1.311 8.093a1 1 0 011.327-.416l1.5 1a1 1 0 00.656.249H4.965a1 1 0 00.656-.249l1.5-1a1 1 0 011.327.416l.689 1.378M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm1.5 0a5.25 5.25 0 10-10.5 0 5.25 5.25 0 0010.5 0z" />
                  </svg>
                </button>
              </div>
              {errors.confirm_password && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirm_password}
                </div>
              )}
            </div>
            <AnimatedButton
              type="submit"
              className="w-full bg-[#0A66C2] text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg shadow"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>Create Account</>
              )}
            </AnimatedButton>
          </form>
          {message && (
            <div className={`mt-6 ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`} aria-live="polite">
              <div className={`p-4 rounded-lg flex items-center ${
                message.includes('success') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <svg className={`w-5 h-5 mr-2 ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  {message.includes('success') ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  )}
                </svg>
                {message}
              </div>
            </div>
          )}
          <div className="mt-8 text-center text-gray-600">
            <span>Already have an account? </span>
            <Link to="/login" className="text-[#0A66C2] hover:underline font-semibold transition-colors duration-200">
              Sign in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Signup; 