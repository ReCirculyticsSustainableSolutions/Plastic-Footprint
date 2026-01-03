import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login, signup } = useProject();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  const handleSignup = async () => {
    const result = await signup(formData.name, formData.email, formData.password);
    if (result.success) {
      alert('Account created! Please login.');
      setActiveTab('login');
    } else {
      alert(result.message);
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
                ? 'border-[#0F4C63] text-[#0F4C63]'
                : 'border-transparent text-[#475569] hover:text-[#0F172A]'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 pb-3 font-semibold transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'signup'
                ? 'border-[#0F4C63] text-[#0F4C63]'
                : 'border-transparent text-[#475569] hover:text-[#0F172A]'
            }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
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
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
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
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-[#0F4C63] text-white py-3 rounded font-semibold hover:bg-[#0D3A4A] transition"
            >
              Sign In
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
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
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
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
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
                className="w-full p-3 border border-[#E2E8F0] rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
              />
            </div>
            <button
               onClick={handleSignup}
              className="w-full bg-[#0F4C63] text-white py-3 rounded font-semibold hover:bg-[#0D3A4A] transition"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
