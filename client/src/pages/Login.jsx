import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login, signup, forgotPassword } = useProject();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [resetData, setResetData] = useState({
    email: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      toast.success('Signed in successfully');
      navigate('/');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await signup(formData.name, formData.email, formData.password);
    setLoading(false);
    if (result.success) {
      toast.success('Account created. Please sign in.');
      setActiveTab('login');
      setFormData(prev => ({ ...prev, password: '' }));
    } else {
      toast.error(result.message || 'Signup failed');
    }
  };

  const handleForgotPassword = async () => {
    if (!resetData.email || !resetData.newPassword) {
      toast.error('Please enter email and new password');
      return;
    }
    if (resetData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await forgotPassword(resetData.email, resetData.newPassword);
    setLoading(false);
    if (result.success) {
      toast.success('Password updated. Please sign in with new password.');
      setActiveTab('login');
      setResetData({ email: '', newPassword: '' });
    } else {
      toast.error(result.message || 'Password reset failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] p-6">
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-lg w-full max-w-[450px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 text-[#0F172A]">Welcome Back</h1>
          <p className="text-[#475569]">Sign in to access your dashboard</p>
        </div>

        <div className="flex gap-2 mb-6 border-b-2 border-[#E2E8F0]">
          <button
            className={`flex-1 pb-3 font-semibold transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'login'
                ? 'border-[#1D4ED8] text-[#1D4ED8]'
                : 'border-transparent text-[#475569] hover:text-[#0F172A]'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 pb-3 font-semibold transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'signup'
                ? 'border-[#1D4ED8] text-[#1D4ED8]'
                : 'border-transparent text-[#475569] hover:text-[#0F172A]'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 pb-3 font-semibold transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'forgot'
                ? 'border-[#1D4ED8] text-[#1D4ED8]'
                : 'border-transparent text-[#475569] hover:text-[#0F172A]'
            }`}
            onClick={() => setActiveTab('forgot')}
          >
            Forgot Password
          </button>
        </div>

        {activeTab === 'login' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0F172A]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0F172A]">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full bg-[#1D4ED8] text-white py-3 rounded font-semibold transition ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#1E40AF]'
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        )}

        {activeTab === 'signup' && (
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium mb-1 text-[#0F172A]">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0F172A]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0F172A]">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
            <button
              onClick={handleSignup}
              disabled={loading}
              className={`w-full bg-[#1D4ED8] text-white py-3 rounded font-semibold transition ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#1E40AF]'
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        )}

        {activeTab === 'forgot' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0F172A]">Email</label>
              <input
                type="email"
                name="email"
                value={resetData.email}
                onChange={handleResetChange}
                placeholder="you@example.com"
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0F172A]">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={resetData.newPassword}
                onChange={handleResetChange}
                placeholder="••••••••"
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
              />
            </div>
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className={`w-full bg-[#1D4ED8] text-white py-3 rounded font-semibold transition ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#1E40AF]'
              }`}
            >
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
