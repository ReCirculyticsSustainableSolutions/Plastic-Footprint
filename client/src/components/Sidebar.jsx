import React from 'react';
import { useProject } from '../context/ProjectContext';
import { FileInput, Calculator, PieChart, LogIn, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

const Sidebar = () => {
  const { activeTab, setActiveTab, clearAll, user } = useProject();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Data Input', id: 'input', icon: FileInput },
    { name: 'Calculations', id: 'results', icon: Calculator },
    { name: 'Analytics', id: 'analytics', icon: PieChart },
  ];

  return (
    <Motion.div 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="w-[280px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-white/10 hidden md:flex flex-col z-10"
    >
      <Motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold mb-2 tracking-tight flex items-center gap-3"
      >
        <span className="text-2xl">📦</span> Packaging Footprint
      </Motion.h2>
      <p className="text-xs text-white/70 mb-6 pl-1">
        Track and analyse your plastic packaging impact.
      </p>

      <div className="mb-6 flex-1">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">
            NAVIGATION
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
            App
          </span>
        </div>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-medium relative overflow-hidden ${
                activeTab === item.id
                  ? 'bg-white/10 text-white shadow-lg border-l-4 border-[#38BDF8]' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              {activeTab === item.id && (
                <Motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3 relative z-10">
                <item.icon size={20} className={activeTab === item.id ? 'text-[#38BDF8]' : 'text-white/70'} />
                <span>{item.name}</span>
              </div>
              <ChevronRight
                size={16}
                className={`relative z-10 transition-transform ${
                  activeTab === item.id ? 'translate-x-0 text-[#38BDF8]' : 'translate-x-1 text-white/30'
                }`}
              />
            </Motion.button>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-white/15 space-y-2">
        <Motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
          whileTap={{ scale: 0.98 }}
          onClick={clearAll}
          className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm text-red-200 hover:text-red-100 transition"
        >
          <Trash2 size={18} /> New Project (Clear)
        </Motion.button>
        {!user && (
          <Motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(37, 99, 235, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm text-blue-300 hover:text-blue-100 transition"
          >
            <LogIn size={18} /> Login
          </Motion.button>
        )}
      </div>
    </Motion.div>
  );
};

export default Sidebar;
