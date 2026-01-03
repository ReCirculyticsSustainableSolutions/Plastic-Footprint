import React from 'react';
import { useProject } from '../context/ProjectContext';
import { LayoutDashboard, FileInput, Calculator, PieChart, LogOut, LogIn, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { activeTab, setActiveTab, projectData, clearAll, user, logout } = useProject();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Project Setup', id: 'project', icon: LayoutDashboard },
    { name: 'Data Input', id: 'input', icon: FileInput },
    { name: 'Calculations', id: 'results', icon: Calculator },
    { name: 'Analytics', id: 'analytics', icon: PieChart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="w-[280px] bg-gradient-to-br from-[#0F4C63] to-[#0D3A4A] text-white p-6 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-white/10 hidden md:flex flex-col z-10"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold mb-8 pb-4 border-b border-white/15 tracking-tight flex items-center gap-3"
      >
        <span className="text-2xl">📦</span> Packaging Footprint
      </motion.h2>

      <div className="mb-6 flex-1">
        <div className="text-xs uppercase tracking-wider text-white/50 mb-4 font-bold pl-2">
          Navigation
        </div>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all text-sm font-medium relative overflow-hidden ${
                activeTab === item.id
                  ? 'bg-white/10 text-white shadow-lg border-l-4 border-[#06B6D4]' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <item.icon size={20} className={activeTab === item.id ? 'text-[#06B6D4]' : ''} />
              <span className="relative z-10">{item.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="text-xs uppercase tracking-wider text-white/50 mb-3 font-bold pl-2">
          Project Info
        </div>
        <div className="text-[13px] text-white/80 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner backdrop-blur-sm">
          <div className="mb-3">
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Project Name</div>
            <div className="font-semibold truncate text-white">{projectData.name || 'Not Set'}</div>
          </div>
          <div className="mb-3">
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Organization</div>
            <div className="font-semibold truncate text-white">{projectData.org || 'Not Set'}</div>
          </div>
          <div>
            <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Period</div>
            <div className="font-medium truncate text-white/90">
                {projectData.startDate && projectData.endDate 
                    ? `${projectData.startDate} to ${projectData.endDate}` 
                    : 'Not Set'}
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="pt-4 border-t border-white/15 space-y-2">
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
          whileTap={{ scale: 0.98 }}
          onClick={clearAll}
          className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm text-red-200 hover:text-red-100 transition"
        >
          <Trash2 size={18} /> New Project (Clear)
        </motion.button>
        {user ? (
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm text-gray-300 hover:text-white transition"
            >
              <LogOut size={18} /> Logout ({user.name})
            </motion.button>
        ) : (
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="w-full text-left flex items-center gap-3 p-3 rounded-lg text-sm text-cyan-300 hover:text-cyan-100 transition"
            >
              <LogIn size={18} /> Login
            </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;
