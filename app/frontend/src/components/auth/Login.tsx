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
    // Password complexity: min 8 chars, at least 1 letter and 1 number
    if (form.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password)) {
      newErrors.password = 'Password must be at least 8 characters and contain a letter and a number';
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
        setTimeout(() => navigate('/feed'), 1000);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-gray-700">Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.usernameOrEmail && <p className="text-red-500 text-sm mt-1">{errors.usernameOrEmail}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <div className={`text-center mt-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 