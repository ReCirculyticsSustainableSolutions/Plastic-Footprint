import React from 'react';
import Sidebar from '../components/Sidebar';
import DataInput from '../components/DataInput';
import Calculations from '../components/Calculations';
import Analytics from '../components/Analytics';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { activeTab, user, logout } = useProject();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top app header like Flowbite: brand on left, user on right */}
        <div className="flex items-center justify-between mb-4 bg-white border-b border-[#E2E8F0] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-sm font-bold">
              PF
            </div>
            <span className="text-base font-semibold text-[#0F172A]">
              Packaging Footprint
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex flex-col items-end">
                <div className="text-sm font-medium text-[#0F172A]">
                  {user.name}
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {user.email}
                </div>
              </div>
            )}
            <div>
              {user ? (
                <button
                  onClick={logout}
                  className="bg-white text-[#1D4ED8] px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition shadow-sm border border-[#E2E8F0]"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-[#1D4ED8] px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition shadow-sm border border-[#E2E8F0]"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main section card for Data Input / Calculations / Analytics */}
        <header className="bg-gradient-to-br from-[#1D4ED8] to-[#6366F1] text-white p-6 rounded-xl mb-6 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1 tracking-tight">
              {activeTab === 'input' && 'Data Input'}
              {activeTab === 'results' && 'Calculations'}
              {activeTab === 'analytics' && 'Analytics'}
            </h2>
            <p className="text-sm opacity-90 max-w-[700px] leading-relaxed">
              {activeTab === 'input' && 'Upload BOM, Sales, Specs, and Material Classification data.'}
              {activeTab === 'results' && 'View detailed footprint calculations and summary.'}
              {activeTab === 'analytics' && 'Visualize insights with interactive charts.'}
            </p>
          </div>
        </header>

        <div className="animate-fade-in">
            {activeTab === 'input' && <DataInput />}
            {activeTab === 'results' && <Calculations />}
            {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
