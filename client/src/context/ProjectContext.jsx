import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const [projectData, setProjectData] = useState({
    name: '',
    org: '',
    startDate: '',
    endDate: '',
    standard: '',
    location: '',
    notes: ''
  });

  const [bomData, setBomData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [specData, setSpecData] = useState([]);
  const [materialClassData, setMaterialClassData] = useState([]);
  const [calculatedResults, setCalculatedResults] = useState([]);
  const [activeTab, setActiveTab] = useState('input');
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount (optional, for persistence)
  useEffect(() => {
    const saved = localStorage.getItem('currentProject');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProjectData(parsed.projectData || {});
        setBomData(parsed.bomData || []);
        setSalesData(parsed.salesData || []);
        setSpecData(parsed.specData || []);
        setMaterialClassData(parsed.materialClassData || []);
        setCalculatedResults(parsed.calculatedResults || []);
      } catch {
        console.error("Failed to load project from local storage");
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('currentProject', JSON.stringify({
      projectData,
      bomData,
      salesData,
      specData,
      materialClassData,
      calculatedResults
    }));
  }, [projectData, bomData, salesData, specData, materialClassData, calculatedResults]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  console.log("Using Backend URL:", API_URL);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, email, mobile, password) => {
    try {
        await axios.post(`${API_URL}/api/user/register`, { name, email, mobile, password });
        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const forgotPassword = async (email, newPassword) => {
    try {
      await axios.post(`${API_URL}/api/user/forgot-password`, { email, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Password reset failed' };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const saveProjectToCloud = async (newResults = null) => {
      console.log("saveProjectToCloud called");
      console.log("Token:", token);
      console.log("API URL:", API_URL);
      if (!token) {
          toast.error("Please login to save to cloud");
          return;
      }
      setLoading(true);
      try {
          console.log("Sending POST request...");
          const res = await axios.post(`${API_URL}/api/projects`, {
              bomData,
              salesData,
              specData,
              materialClassData,
              calculatedResults: newResults || calculatedResults
          }, {
              headers: { 'auth-token': token }
          });
          console.log("Save Response:", res.data);
          toast.success("Project saved to cloud successfully!");
      } catch (err) {
          console.error("Save Error Details:", err);
          const errorMsg = err.response ? err.response.data.error || err.response.data.message : err.message;
          toast.error(`Failed to save: ${errorMsg}`);
      } finally {
          setLoading(false);
      }
  };

  const calculateFootprints = () => {
    if (bomData.length === 0 || salesData.length === 0 || specData.length === 0) {
      toast.error('Please load all required data sheets: Bill of Material, Sales Data, and Specification');
      return;
    }

    const results = [];

    salesData.forEach(sale => {
      const bomEntries = bomData.filter(b => b.skuCode === sale.skuCode);
      
      bomEntries.forEach(bom => {
        const spec = specData.find(s => s.compCode === bom.compCode);
        
        if (spec) {
          // Footprint (MT) = (Sales Qty MT × Standard Consumption per MT × Weight/pc gms) / 1,000,000
          const footprintMT = (sale.qty * bom.consumption * spec.weight) / 1000000;
          const recycledContentMT = footprintMT * (spec.recycled / 100);
          
          const matClassRecord = materialClassData.find(m => m.material === spec.material);
          const classification = matClassRecord ? matClassRecord.classification : spec.matClass;

          results.push({
            skuCode: sale.skuCode,
            skuDesc: sale.skuDesc,
            compCode: bom.compCode,
            compDesc: bom.compDesc,
            material: spec.material,
            materialClass: classification,
            salesQty: sale.qty,
            consumption: bom.consumption,
            weight: spec.weight,
            footprint: footprintMT,
            recycledPct: spec.recycled,
            recycledContent: recycledContentMT,
            state: sale.state,
            date: sale.date,
            flexibility: spec.flexibility
          });
        }
      });
    });

    if (results.length === 0) {
      toast.error('No matching data found. Check that SKU codes and Component codes align across sheets.');
      return;
    }

    setCalculatedResults(results);
    setActiveTab('results');
    
    // Auto-save calculated results to cloud/DB immediately
    if (token) {
       // We need to wait for state update or pass results directly. 
       // Since state update is async, let's call save with explicit new results or ensure saveProjectToCloud uses latest state.
       // Ideally, saveProjectToCloud reads from state which might be stale in this closure.
       // Better approach: modify saveProjectToCloud to accept optional data override, or just trigger it.
       // For simplicity, we'll assume state update happens fast enough or we pass the new results to a modified save function.
       // Let's modify saveProjectToCloud to optionally take data to save.
       saveProjectToCloud(results); 
    }
    
    toast.success(`Calculated ${results.length} rows successfully!`);
  };

  const clearAll = () => {
    if (window.confirm('Clear all project data?')) {
      setProjectData({
        name: '', org: '', startDate: '', endDate: '', standard: '', location: '', notes: ''
      });
      setBomData([]);
      setSalesData([]);
      setSpecData([]);
      setMaterialClassData([]);
      setCalculatedResults([]);
      localStorage.removeItem('currentProject');
    }
  };

  return (
    <ProjectContext.Provider value={{
      user, token, login, signup, logout, forgotPassword, saveProjectToCloud,
      projectData, setProjectData,
      bomData, setBomData,
      salesData, setSalesData,
      specData, setSpecData,
      materialClassData, setMaterialClassData,
      calculatedResults, setCalculatedResults,
      activeTab, setActiveTab,
      loading, setLoading,
      calculateFootprints,
      clearAll
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
