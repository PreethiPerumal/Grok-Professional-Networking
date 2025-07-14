import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './api';
import Card from '../posts/Card';
import AnimatedButton from '../posts/AnimatedButton';

const Login: React.FC = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.usernameOrEmail) newErrors.usernameOrEmail = 'Username or Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password && form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage(null);
    try {
      const credentials = form.usernameOrEmail.includes('@')
        ? { email: form.usernameOrEmail, password: form.password }
        : { username: form.usernameOrEmail, password: form.password };
      const res = await authApi.login(credentials);
      if (res.token) {
        localStorage.setItem('token', res.token);
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/profile'), 1000);
      } else {
        setMessage(res.error || 'Login failed.');
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
          <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-6 border-4 border-white shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Welcome Back!</h2>
          <p className="text-blue-100 text-lg">Connect, grow, and advance your career.</p>
        </div>
        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <span className="block text-3xl font-extrabold tracking-tight text-main">Grok</span>
            <span className="block text-lg font-bold tracking-tight text-accent mt-1">Professional-Networking</span>
          </div>
          <h2 className="text-2xl font-bold text-main mb-2">Sign in to your account</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-6">Stay updated on your professional world</p>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-semibold text-main mb-2">Username or Email</label>
              <input
                type="text"
                name="usernameOrEmail"
                value={form.usernameOrEmail}
                onChange={handleChange}
                className="w-full bg-secondary border-2 border-gray-200 dark:border-[#232946] rounded-lg p-3 text-main placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-all duration-200"
                placeholder="Enter your username or email"
                disabled={loading}
              />
              {errors.usernameOrEmail && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.usernameOrEmail}
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
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg
                    className="h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.96 9.96 0 011.563-2.037m3.12 3.12A3 3 0 0012 15a3 3 0 003-3 3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.96 9.96 0 011.563-2.037m3.12 3.12A3 3 0 0012 15a3 3 0 003-3 3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3z" />
                    )}
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
                  Signing In...
                </>
              ) : (
                <>Sign In</>
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
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-[#0A66C2] hover:underline font-semibold transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Sign up
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login; 