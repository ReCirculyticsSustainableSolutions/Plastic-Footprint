import React, { useState, useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import * as XLSX from 'xlsx';
import { Download, PieChart, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Calculations = () => {
  const { calculatedResults, setActiveTab } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const exportResults = () => {
    if (calculatedResults.length === 0) return;

    const wb = XLSX.utils.book_new();
    
    // Export calculated results
    const resultsSheet = XLSX.utils.json_to_sheet(calculatedResults);
    XLSX.utils.book_append_sheet(wb, resultsSheet, 'Calculated Results');
    
    // Export summary by material
    const materialSummary = {};
    calculatedResults.forEach(row => {
        if (!materialSummary[row.materialClass]) {
            materialSummary[row.materialClass] = {material: row.materialClass, footprint: 0, recycledContent: 0, count: 0};
        }
        materialSummary[row.materialClass].footprint += row.footprint;
        materialSummary[row.materialClass].recycledContent += row.recycledContent;
        materialSummary[row.materialClass].count++;
    });
    const summarySheet = XLSX.utils.json_to_sheet(Object.values(materialSummary));
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Material Summary');
    
    XLSX.writeFile(wb, 'Packaging_Footprint_Analysis.xlsx');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedResults = useMemo(() => {
    let results = [...calculatedResults];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      results = results.filter(row => 
        row.skuCode?.toString().toLowerCase().includes(lowerTerm) ||
        row.material?.toLowerCase().includes(lowerTerm) ||
        row.materialClass?.toLowerCase().includes(lowerTerm) ||
        row.compCode?.toString().toLowerCase().includes(lowerTerm)
      );
    }

    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return results;
  }, [calculatedResults, searchTerm, sortConfig]);

  if (calculatedResults.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-500">No calculation results yet.</h2>
        <p className="text-gray-400 mt-2">Go to Data Input and click "Calculate Packaging Footprints".</p>
      </div>
    );
  }

  // Basic Stats
  const totalFootprint = calculatedResults.reduce((sum, r) => sum + r.footprint, 0);
  const totalRecycled = calculatedResults.reduce((sum, r) => sum + r.recycledContent, 0);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={14} className="text-[#1D4ED8]" /> : 
      <ArrowDown size={14} className="text-[#1D4ED8]" />;
  };

  const SortableHeader = ({ label, column, align = 'left' }) => (
    <th 
      className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors select-none text-${align}`}
      onClick={() => handleSort(column)}
    >
      <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        <SortIcon column={column} />
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#EFF6FF] p-6 rounded-lg border-l-4 border-[#1D4ED8]"
        >
          <h3 className="text-[#1D4ED8] font-semibold text-sm uppercase tracking-wide">Total Packaging Footprint</h3>
          <p className="text-4xl font-bold text-[#0F172A] mt-2">{totalFootprint.toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-lg text-gray-500 font-normal">MT</span></p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
            className="bg-[#EFF6FF] p-6 rounded-lg border-l-4 border-[#38BDF8]"
        >
          <h3 className="text-[#38BDF8] font-semibold text-sm uppercase tracking-wide">Total Recycled Content</h3>
          <p className="text-4xl font-bold text-[#0F172A] mt-2">{totalRecycled.toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-lg text-gray-500 font-normal">MT</span></p>
        </motion.div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-[#E2E8F0] gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="font-bold text-lg text-[#0F172A] whitespace-nowrap">Detailed Results ({processedResults.length})</h2>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search SKU, Material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] transition-all"
                />
            </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => setActiveTab('analytics')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] text-white rounded hover:bg-[#1E40AF] transition"
          >
            <PieChart size={18} /> <span className="hidden sm:inline">View Analytics</span>
          </button>
          <button 
            onClick={exportResults}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded hover:bg-black transition"
          >
            <Download size={18} /> <span className="hidden sm:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8FAFC] text-[#475569] font-semibold sticky top-0 z-10 shadow-sm">
              <tr>
                <SortableHeader label="SKU Code" column="skuCode" />
                <SortableHeader label="Component" column="compCode" />
                <SortableHeader label="Material" column="material" />
                <SortableHeader label="Class" column="materialClass" />
                <SortableHeader label="Sales Qty" column="salesQty" align="right" />
                <SortableHeader label="Weight (g)" column="weight" align="right" />
                <SortableHeader label="Footprint (MT)" column="footprint" align="right" />
                <SortableHeader label="Recycled (MT)" column="recycledContent" align="right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              <AnimatePresence>
                {processedResults.slice(0, 100).map((row, idx) => (
                    <motion.tr 
                        key={`${row.skuCode}-${idx}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-[#F1F5F9]"
                    >
                    <td className="p-4 font-medium">{row.skuCode}</td>
                    <td className="p-4">{row.compCode}</td>
                    <td className="p-4">{row.material}</td>
                    <td className="p-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{row.materialClass}</span>
                    </td>
                    <td className="p-4 text-right">{row.salesQty}</td>
                    <td className="p-4 text-right">{row.weight}</td>
                    <td className="p-4 text-right font-bold text-[#1D4ED8]">{row.footprint.toFixed(4)}</td>
                    <td className="p-4 text-right text-[#38BDF8]">{row.recycledContent.toFixed(4)}</td>
                    </motion.tr>
                ))}
              </AnimatePresence>
              {processedResults.length === 0 && (
                  <tr>
                      <td colspan="8" className="p-8 text-center text-gray-500">
                          No results match your search.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
        {processedResults.length > 100 && (
          <div className="p-4 text-center text-gray-500 bg-[#F8FAFC] border-t">
            Showing first 100 results of {processedResults.length}. Export to see all data.
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculations;
