import React from 'react';
import { Cpu, CheckCircle } from 'lucide-react';

export const ModelCard = ({ model, isPrimary }) => {
  if (!model) return null;

  const metrics = [
    { label: 'Accuracy', val: model.accuracy, color: '#0B5CAD' },
    { label: 'Precision', val: model.precision, color: '#1464B4' },
    { label: 'Recall', val: model.recall, color: '#0F9D9A' },
    { label: 'F1-Score', val: model.f1_score, color: '#6366F1' },
    { label: 'ROC-AUC', val: model.roc_auc, color: '#22A06B' },
  ];

  return (
    <div className={`bg-white border rounded-[14px] p-6 shadow-xs relative transition-all ${
      isPrimary ? 'border-[#0B5CAD] ring-1 ring-[#0B5CAD]/30' : 'border-[#E2E8F0]'
    }`}>
      {/* Primary Badge */}
      {isPrimary && (
        <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#E8F2FC] border border-[#D0E3F9] text-[#0B5CAD] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-[#0B5CAD]" />
          <span>Active Primary Model</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#E8F2FC] border border-[#D0E3F9] text-[#0B5CAD] flex items-center justify-center shrink-0">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-[#172B4D] text-base">{model.model_name}</h3>
          <p className="text-xs text-[#64748B]">Algorithm: <span className="font-medium text-[#172B4D]">{model.algorithm}</span></p>
        </div>
      </div>

      {/* Main Metric Highlight */}
      <div className="p-3.5 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-semibold text-[#64748B] uppercase block">Accuracy Score</span>
          <span className="text-2xl font-bold text-[#0B5CAD]">{(model.accuracy * 100).toFixed(1)}%</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase block">ROC-AUC</span>
          <span className="text-xl font-bold text-[#22A06B]">{model.roc_auc.toFixed(3)}</span>
        </div>
      </div>

      {/* Metric Breakdown Bars */}
      <div className="space-y-2.5">
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#64748B]">{m.label}</span>
              <span className="text-[#172B4D] font-bold">{(m.val * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden border border-[#E2E8F0]">
              <div
                className="h-full bg-[#0B5CAD] rounded-full transition-all duration-700"
                style={{ width: `${m.val * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
