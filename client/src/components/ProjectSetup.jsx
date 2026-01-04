import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Save } from 'lucide-react';

const ProjectSetup = () => {
  const { projectData, setProjectData, setActiveTab, saveProjectToCloud, token, loading } = useProject();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!projectData.name || !projectData.org || !projectData.startDate || !projectData.endDate) {
      alert('Please fill all required fields (marked with *)');
      return;
    }
    setActiveTab('input');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-[#E2E8F0]">
      <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Project Setup</h2>
            <p className="text-[#475569] text-[15px] mt-1">
                Initialize your packaging footprint analysis project with organization details and compliance period.
            </p>
          </div>
          {token && (
              <button 
                onClick={saveProjectToCloud}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 bg-[#F1F5F9] text-[#0F4C63] border border-[#E2E8F0] rounded hover:bg-[#E2E8F0] transition text-sm font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                  <Save size={16} /> {loading ? 'Saving...' : 'Save to Cloud'}
              </button>
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-sm">Project Name *</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            placeholder="e.g., Q4 2025 EPR Compliance Analysis"
            className="border border-[#E2E8F0] p-3 rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-sm">Organization Name *</label>
          <input
            type="text"
            name="org"
            value={projectData.org}
            onChange={handleChange}
            placeholder="e.g., Your Company Ltd."
            className="border border-[#E2E8F0] p-3 rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-sm">Analysis Start Date *</label>
          <input
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            className="border border-[#E2E8F0] p-3 rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-sm">Analysis End Date *</label>
          <input
            type="date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
            className="border border-[#E2E8F0] p-3 rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-sm">Reporting Standard</label>
          <select
            name="standard"
            value={projectData.standard}
            onChange={handleChange}
            className="border border-[#E2E8F0] p-3 rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          >
            <option value="">Select Standard</option>
            <option value="India EPR Rules 2016">India EPR Rules 2016</option>
            <option value="India EPR Rules 2022 Amendment">India EPR Rules 2022 Amendment</option>
            <option value="Extended Producer Responsibility Rules">Extended Producer Responsibility Rules</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-sm">Primary Facility Location</label>
          <select
            name="location"
            value={projectData.location}
            onChange={handleChange}
            className="border border-[#E2E8F0] p-3 rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
          >
            <option value="">Select State/Region</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Goa">Goa</option>
            <option value="Haryana">Haryana</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Pan-India">Pan-India</option>
          </select>
        </div>
      </div>

       <div className="flex flex-col mb-6">
          <label className="mb-2 font-medium text-sm">Project Description / Notes</label>
          <textarea
            name="notes"
            value={projectData.notes}
            onChange={handleChange}
            placeholder="Add any relevant notes about this project..."
            className="border border-[#E2E8F0] p-3 rounded bg-[#F1F5F9] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] min-h-[120px]"
          ></textarea>
        </div>

      <div className="flex justify-end mt-8 gap-4">
        <button
          onClick={handleSave}
          className="bg-[#0F4C63] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D3A4A] transition shadow-md"
        >
          ✓ Save & Continue to Data Input
        </button>
      </div>
    </div>
  );
};

export default ProjectSetup;
