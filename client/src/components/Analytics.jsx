import React, { useMemo } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { calculatedResults } = useProject();

  const chartsData = useMemo(() => {
    if (calculatedResults.length === 0) return null;

    // 1. Material Classification (Doughnut)
    const materialMap = {};
    calculatedResults.forEach(r => {
      materialMap[r.materialClass] = (materialMap[r.materialClass] || 0) + r.footprint;
    });
    const materialLabels = Object.keys(materialMap);
    const materialValues = Object.values(materialMap);

    // 2. Top 10 SKUs (Bar)
    const skuMap = {};
    calculatedResults.forEach(r => {
      skuMap[r.skuCode] = (skuMap[r.skuCode] || 0) + r.footprint;
    });
    const sortedSkus = Object.entries(skuMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const skuLabels = sortedSkus.map(s => s[0]);
    const skuValues = sortedSkus.map(s => s[1]);

    // 3. State Wise (Bar)
    const stateMap = {};
    calculatedResults.forEach(r => {
        if(r.state) stateMap[r.state] = (stateMap[r.state] || 0) + r.footprint;
    });
    const stateLabels = Object.keys(stateMap);
    const stateValues = Object.values(stateMap);

    // 4. Recycled vs Virgin (Doughnut)
    const totalFootprint = calculatedResults.reduce((sum, r) => sum + r.footprint, 0);
    const totalRecycled = calculatedResults.reduce((sum, r) => sum + r.recycledContent, 0);
    const totalVirgin = totalFootprint - totalRecycled;

    return {
      material: {
        labels: materialLabels,
        datasets: [{
          data: materialValues,
          backgroundColor: ['#1D4ED8', '#1E40AF', '#2563EB', '#38BDF8', '#0EA5E9', '#E0F2FE'],
        }]
      },
      sku: {
        labels: skuLabels,
        datasets: [{
          label: 'Footprint (MT)',
          data: skuValues,
          backgroundColor: '#1D4ED8',
        }]
      },
      state: {
        labels: stateLabels,
        datasets: [{
          label: 'Footprint (MT)',
          data: stateValues,
          backgroundColor: '#38BDF8',
        }]
      },
      recycled: {
        labels: ['Virgin Material', 'Recycled Content'],
        datasets: [{
          data: [totalVirgin, totalRecycled],
          backgroundColor: ['#CBD5E1', '#1D4ED8'],
        }]
      }
    };
  }, [calculatedResults]);

  if (!chartsData) {
    return <div className="text-center py-20 text-gray-500">No data available for analytics. Please calculate footprints first.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-[#E2E8F0] h-[400px]"
      >
        <h3 className="text-[#0F172A] font-bold mb-4">Material Classification Breakup</h3>
        <div className="h-[300px] flex justify-center">
            <Doughnut data={chartsData.material} options={{ maintainAspectRatio: false }} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-[#E2E8F0] h-[400px]"
      >
        <h3 className="text-[#0F172A] font-bold mb-4">Top 10 High-Impact SKUs</h3>
        <div className="h-[300px]">
            <Bar data={chartsData.sku} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-[#E2E8F0] h-[400px]"
      >
        <h3 className="text-[#0F172A] font-bold mb-4">State-wise Footprint Distribution</h3>
        <div className="h-[300px]">
            <Bar data={chartsData.state} options={{ maintainAspectRatio: false }} />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-[#E2E8F0] h-[400px]"
      >
        <h3 className="text-[#0F172A] font-bold mb-4">Virgin vs Recycled Content</h3>
        <div className="h-[300px] flex justify-center">
            <Doughnut data={chartsData.recycled} options={{ maintainAspectRatio: false }} />
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
