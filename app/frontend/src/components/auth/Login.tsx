import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './api';

const Login: React.FC = () => {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = useState<{ usernameOrEmail?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.usernameOrEmail) newErrors.usernameOrEmail = 'Username or Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    // Only require minimum length 8, allow any character
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
      // Try both username and email as identifier
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 card">
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: 'var(--accent)' }}>Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block mb-1" style={{ color: 'var(--accent)' }}>Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={handleChange}
              className="input-theme w-full"
              placeholder="Enter your username or email"
              disabled={loading}
            />
            {errors.usernameOrEmail && <p className="text-red-500 text-sm mt-1">{errors.usernameOrEmail}</p>}
          </div>
          <div>
            <label className="block mb-1" style={{ color: 'var(--accent)' }}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-theme w-full"
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="btn-accent w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <div className={`text-center mt-4 ${message.includes('success') ? 'text-green-400' : 'text-red-500'}`}>{message}</div>}
        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="btn-accent-outline ml-1">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 