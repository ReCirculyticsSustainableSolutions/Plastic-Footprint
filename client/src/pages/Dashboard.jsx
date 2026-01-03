import React from 'react';
import Sidebar from '../components/Sidebar';
import ProjectSetup from '../components/ProjectSetup';
import DataInput from '../components/DataInput';
import Calculations from '../components/Calculations';
import Analytics from '../components/Analytics';
import { useProject } from '../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { activeTab } = useProject();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <header className="bg-gradient-to-br from-[#0F4C63] to-[#1B6B8E] text-white p-10 rounded-xl mb-8 shadow-lg relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -top-1/2 -right-[10%] w-[400px] h-[400px] bg-white/10 rounded-full pointer-events-none"></div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
                {activeTab === 'project' && 'Project Setup'}
                {activeTab === 'input' && 'Data Input'}
                {activeTab === 'results' && 'Calculations'}
                {activeTab === 'analytics' && 'Analytics'}
              </h1>
              <p className="text-base opacity-90 max-w-[700px] leading-relaxed">
                {activeTab === 'project' && 'Initialize your packaging footprint analysis project.'}
                {activeTab === 'input' && 'Upload BOM, Sales, Specs, and Material Classification data.'}
                {activeTab === 'results' && 'View detailed footprint calculations and summary.'}
                {activeTab === 'analytics' && 'Visualize insights with interactive charts.'}
              </p>
            </div>
            
            <div className="flex gap-4 items-center">
               <button 
                onClick={() => navigate('/login')}
                className="bg-white text-[#0F4C63] px-4 py-2 rounded font-semibold hover:bg-gray-100 transition shadow-sm"
               >
                 Login / Sign Up
               </button>
            </div>
          </div>
        </header>

        <div className="animate-fade-in">
            {activeTab === 'project' && <ProjectSetup />}
            {activeTab === 'input' && <DataInput />}
            {activeTab === 'results' && <Calculations />}
            {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
