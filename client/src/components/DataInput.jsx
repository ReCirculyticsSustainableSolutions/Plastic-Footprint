import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useProject } from '../context/ProjectContext';
import { Upload, Plus, Trash2, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const DataInput = () => {
  const [activeInputTab, setActiveInputTab] = useState('bom');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    bomData, setBomData, 
    salesData, setSalesData, 
    specData, setSpecData, 
    materialClassData, setMaterialClassData,
    calculateFootprints,
    token,
    saveProjectToCloud,
    setActiveTab
  } = useProject();

  // Helper to read Excel
  const processFile = (file, type) => {
    if (!file) return;
    
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet);
        
        if (type === 'bom') {
          const parsed = rows.map(r => ({
            skuCode: r['SKU Code'] || '',
            skuDesc: r['SKU Description'] || '',
            compCode: r['Component Code'] || '',
            compDesc: r['Component Description'] || '',
            consumption: parseFloat(r['Standard Consumption (Per MT)'] || 0),
            uom: r['UOM'] || '',
            packType: r['Packaging Type'] || ''
          })).filter(r => r.skuCode && r.compCode && r.consumption > 0);
          setBomData(prev => [...prev, ...parsed]);
          toast.success(`✅ ${parsed.length} BOM rows imported`);
        } else if (type === 'sales') {
           const parsed = rows.map(r => ({
              date: r['Date'] || '',
              skuCode: r['SKU Code'] || '',
              skuDesc: r['SKU Description'] || '',
              state: r['State'] || '',
              qty: parseFloat(r['Sales Qty (Net Wt.) (In MT)'] || r['Sales Qty'] || 0)
          })).filter(r => r.skuCode && r.qty > 0);
          setSalesData(prev => [...prev, ...parsed]);
          toast.success(`✅ ${parsed.length} Sales rows imported`);
        } else if (type === 'spec') {
           const parsed = rows.map(r => ({
              compCode: r['Component Code'] || '',
              compDesc: r['Component Description'] || '',
              baseUom: r['Base UOM'] || '',
              material: r['Material'] || '',
              composition: parseFloat(r['Material Composition %'] || 0),
              recycled: parseFloat(r['Recycled Content %'] || 0),
              weight: parseFloat(r['Weight / pc (In Grms)'] || 0),
              flexibility: r['Flexibility'] || '',
              matClass: r['Material Classification'] || ''
          })).filter(r => r.compCode && r.material && r.weight > 0);
          setSpecData(prev => [...prev, ...parsed]);
          toast.success(`✅ ${parsed.length} Specification rows imported`);
        } else if (type === 'material') {
           const parsed = rows.map(r => ({
              material: r['Material'] || '',
              classification: r['Material Classification'] || ''
          })).filter(r => r.material && r.classification);
          setMaterialClassData(prev => [...prev, ...parsed]);
          toast.success(`✅ ${parsed.length} Classifications imported`);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error parsing file: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileUpload = (e, type) => {
    if (!token) {
      toast.error('Kindly login 1st');
      e.target.value = '';
      return;
    }
    processFile(e.target.files[0], type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!token) {
      toast.error('Kindly login 1st');
      return;
    }
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0], activeInputTab);
    }
  };

  const renderTable = (data, columns) => (
      <div className="overflow-x-auto max-h-[500px] border rounded-lg border-[#E2E8F0] shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#F8FAFC] text-[#475569] font-semibold sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map(c => <th key={c} className="p-3 border-b">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] bg-white">
            {data.length === 0 ? (
                <tr>
                    <td colSpan={columns.length} className="p-10 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                            <FileSpreadsheet size={48} className="opacity-20" />
                            <p>No data loaded yet</p>
                            <p className="text-xs">Upload an Excel file to get started</p>
                        </div>
                    </td>
                </tr>
            ) : (
                data.map((row, idx) => (
                    <motion.tr 
                        key={idx} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.005 }} // Staggered entry
                        className="hover:bg-[#F1F5F9] transition-colors"
                    >
                        {Object.values(row).map((val, i) => (
                            <td key={i} className="p-3 whitespace-nowrap">{val}</td>
                        ))}
                    </motion.tr>
                ))
            )}
          </tbody>
        </table>
      </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-[#E2E8F0]"
    >
      {/* Sub Tabs */}
      <div className="flex border-b border-[#E2E8F0] mb-6 overflow-x-auto gap-2">
        {['bom', 'sales', 'spec', 'material'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveInputTab(tab)}
            className={`px-4 py-3 font-medium text-sm transition-all whitespace-nowrap rounded-t-lg relative ${
              activeInputTab === tab
                ? 'text-[#14532D] bg-gray-50'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-gray-50/50'
            }`}
          >
            {tab === 'bom' && 'Bill of Material'}
            {tab === 'sales' && 'Sales Data'}
            {tab === 'spec' && 'Specification'}
            {tab === 'material' && 'Material Classification'}
            {activeInputTab === tab && (
                <motion.div 
                    layoutId="activeInputTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22C55E]"
                />
            )}
          </button>
        ))}
      </div>

      <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-[#0F172A]">
                {activeInputTab === 'bom' && 'Upload Bill of Material'}
                {activeInputTab === 'sales' && 'Upload Sales Data'}
                {activeInputTab === 'spec' && 'Upload Specifications'}
                {activeInputTab === 'material' && 'Upload Material Classifications'}
            </h3>
            <div className="flex gap-2">
                 <label className="flex items-center gap-2 px-4 py-2 bg-[#1D4ED8] text-white rounded-lg cursor-pointer hover:bg-[#1E40AF] transition text-sm font-medium shadow-md active:scale-95 transform">
                    <Upload size={16} />
                    Import Excel
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e, activeInputTab)} />
                </label>
            </div>
        </div>

        {/* Drag and Drop Zone */}
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
                "border-2 border-dashed rounded-xl p-8 mb-6 transition-all duration-200 flex flex-col items-center justify-center gap-3",
                isDragging 
                    ? "border-[#38BDF8] bg-[#E0F2FE] scale-[1.01]" 
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
            )}
        >
            <div className={clsx("p-4 rounded-full transition-colors", isDragging ? "bg-[#DBEAFE]" : "bg-white shadow-sm")}>
                <Upload size={24} className={isDragging ? "text-[#38BDF8]" : "text-gray-400"} />
            </div>
            <div className="text-center">
                <p className="font-medium text-gray-700">
                    {isDragging ? "Drop file here" : "Drag & Drop Excel file here"}
                </p>
                <p className="text-sm text-gray-400 mt-1">or click "Import Excel" button above</p>
            </div>
            {isLoading && <p className="text-[#1D4ED8] font-medium animate-pulse">Processing file...</p>}
        </div>

        <AnimatePresence mode='wait'>
            <motion.div
                key={activeInputTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
            >
                {activeInputTab === 'bom' && renderTable(bomData, ['SKU Code', 'SKU Desc', 'Comp Code', 'Comp Desc', 'Consumption', 'UOM', 'Pack Type'])}
                {activeInputTab === 'sales' && renderTable(salesData, ['Date', 'SKU Code', 'SKU Desc', 'State', 'Qty (MT)'])}
                {activeInputTab === 'spec' && renderTable(specData, ['Comp Code', 'Comp Desc', 'Base UOM', 'Material', 'Composition %', 'Recycled %', 'Weight (g)', 'Flexibility', 'Mat Class'])}
                {activeInputTab === 'material' && renderTable(materialClassData, ['Material', 'Classification'])}
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-6 pt-6 border-t border-[#E2E8F0]">
        <button
          onClick={() => {
            setActiveTab('input');
          }}
          className="px-6 py-2 text-[#475569] hover:text-[#0F172A] font-medium transition"
        >
          ← Back to Setup
        </button>
        {activeInputTab === 'material' && (
          <button
            onClick={() => {
              calculateFootprints();
            }}
            className="bg-[#1D4ED8] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1E40AF] transition shadow-lg flex items-center gap-2"
          >
            Run Calculation & Save →
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DataInput;
