import React from 'react';
import { useApi } from '../hooks/useApi';
import { modelsApi } from '../api/api';
import { ModelCard } from '../components/ModelCard';
import { ChartCard } from '../components/ChartCard';
import { Loading } from '../components/Loading';
import { Cpu } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export const Models = () => {
  const { data, loading } = useApi(modelsApi.getModels);

  if (loading) return <Loading text="Loading ML model metrics..." />;

  const modelsList = data?.models || [];
  const primaryModel = data?.primary_active_model || 'Random Forest Classifier';

  const comparisonData = modelsList.map(m => ({
    name: m.algorithm,
    Accuracy: Number((m.accuracy * 100).toFixed(1)),
    Precision: Number((m.precision * 100).toFixed(1)),
    Recall: Number((m.recall * 100).toFixed(1)),
    F1Score: Number((m.f1_score * 100).toFixed(1)),
    RocAuc: Number((m.roc_auc * 100).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0B5CAD] uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4" />
          <span>Model Performance & Evaluation</span>
        </div>
        <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">Machine Learning Model Registry</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Performance metrics calculated on 70,000 cardiology dataset records.
        </p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modelsList.map((model) => (
          <ModelCard 
            key={model.id || model.model_name} 
            model={model} 
            isPrimary={model.model_name === primaryModel || model.algorithm === 'Random Forest'} 
          />
        ))}
      </div>

      {/* Model Comparison Chart */}
      <ChartCard 
        title="Model Performance Comparison (%)" 
        subtitle="Benchmark evaluation of Accuracy, Precision, Recall, F1 Score, and ROC-AUC"
      >
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748B" domain={[50, 100]} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', fontSize: '12px' }} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="Accuracy" fill="#0B5CAD" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Precision" fill="#1464B4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Recall" fill="#0F9D9A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="F1Score" fill="#6366F1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="RocAuc" fill="#22A06B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
};
