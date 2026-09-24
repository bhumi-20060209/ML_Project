import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Cpu, Calendar, RotateCcw, Info, HeartPulse } from 'lucide-react';

export const PredictionResult = ({ result, onNewPrediction }) => {
  if (!result) return null;

  const isHighRisk = result.prediction === 1;
  const probabilityPct = (result.probability * 100).toFixed(1);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Top Banner Result Card */}
      <div className={`p-6 rounded-[14px] border flex flex-col md:flex-row items-center justify-between gap-6 ${
        isHighRisk 
          ? 'bg-[#FDF2F4] border-[#FAD4DA] text-[#E63950]' 
          : 'bg-[#EAF8F2] border-[#C3EBD8] text-[#22A06B]'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
            isHighRisk 
              ? 'bg-white border-[#FAD4DA] text-[#E63950]' 
              : 'bg-white border-[#C3EBD8] text-[#22A06B]'
          }`}>
            {isHighRisk ? <ShieldAlert className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">CARDIOVASCULAR RISK ASSESSMENT</span>
            <h2 className="text-2xl font-bold tracking-tight mt-0.5">
              {isHighRisk ? 'HIGH RISK' : 'LOW RISK'}
            </h2>
            <p className="text-xs mt-1 text-[#172B4D] font-medium">
              {isHighRisk 
                ? 'Clinical indicators suggest elevated cardiovascular risk. Physician consultation recommended.' 
                : 'Patient health parameters fall within baseline low-risk ranges.'}
            </p>
          </div>
        </div>

        {/* Probability Meter */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-[#E2E8F0] shrink-0 min-w-[140px] shadow-2xs">
          <span className="text-[10px] font-semibold uppercase text-[#64748B]">Probability Score</span>
          <span className={`text-2xl font-black mt-0.5 ${isHighRisk ? 'text-[#E63950]' : 'text-[#22A06B]'}`}>
            {probabilityPct}%
          </span>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-[#E2E8F0]">
            <div 
              className={`h-full transition-all duration-700 ${isHighRisk ? 'bg-[#E63950]' : 'bg-[#22A06B]'}`}
              style={{ width: `${probabilityPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Execution Info & Input Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Clinical Recommendations */}
        <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase text-[#172B4D] tracking-wider flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#0B5CAD]" />
            <span>Clinical Summary</span>
          </h4>
          
          <ul className="space-y-2 text-xs text-[#172B4D]">
            {isHighRisk ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-[#E63950] font-bold">•</span>
                  <span><strong>Cardiology Follow-up:</strong> Evaluation by a specialist is advised.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E63950] font-bold">•</span>
                  <span><strong>BP Monitoring:</strong> Log daily morning & evening BP values.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#E63950] font-bold">•</span>
                  <span><strong>Lifestyle Adjustment:</strong> Reduce sodium and saturated fat intake.</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-[#22A06B] font-bold">•</span>
                  <span><strong>Healthy Profile:</strong> Indicators align with standard baseline health.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#22A06B] font-bold">•</span>
                  <span><strong>Maintenance:</strong> Continue regular physical exercise and balanced diet.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Model Execution Metadata */}
        <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase text-[#172B4D] tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0B5CAD]" />
            <span>Execution Details</span>
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#E2E8F0] text-[#64748B]">
              <span>ML Algorithm</span>
              <span className="font-semibold text-[#172B4D]">{result.model_used || 'Random Forest'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0] text-[#64748B]">
              <span>Prediction Date</span>
              <span className="font-semibold text-[#172B4D]">{result.created_at || new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-1 text-[#64748B]">
              <span>Database Log ID</span>
              <span className="font-mono text-[#0B5CAD] font-bold">#PRD-{result.id}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Submitted Parameters Summary Table */}
      <div className="bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl p-5">
        <h4 className="text-xs font-bold uppercase text-[#64748B] tracking-wider mb-3">Submitted Patient Indicators</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Age / Gender</span>
            <span className="font-bold text-[#172B4D]">{result.age} yrs ({result.gender})</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Height / Weight</span>
            <span className="font-bold text-[#172B4D]">{result.height} cm / {result.weight} kg</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Blood Pressure</span>
            <span className="font-bold text-[#172B4D]">{result.ap_hi} / {result.ap_lo} mmHg</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] block font-semibold">Body Mass Index</span>
            <span className="font-bold text-[#172B4D]">{result.bmi} kg/m²</span>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-amber-600" />
        <p className="leading-tight">
          <strong>Medical Disclaimer:</strong> AI prediction for educational and project demonstration purposes only. This result is not a medical diagnosis.
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={onNewPrediction}
          className="px-5 py-2.5 rounded-xl bg-[#0B5CAD] hover:bg-[#08488A] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Patient Assessment</span>
        </button>
      </div>

    </div>
  );
};
