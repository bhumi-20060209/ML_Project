import React, { useState } from 'react';
import { PredictionForm } from '../components/PredictionForm';
import { PredictionResult } from '../components/PredictionResult';
import { predictionApi } from '../api/api';
import { Stethoscope, AlertTriangle } from 'lucide-react';

export const Prediction = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictionApi.predict(formData);
      setResult(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to execute ML prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleNewPrediction = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0B5CAD] uppercase tracking-wider mb-1">
          <Stethoscope className="w-4 h-4" />
          <span>Clinical Assessment Tool</span>
        </div>
        <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">Cardiovascular Risk Assessment</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Enter patient health information to estimate cardiovascular disease risk using Random Forest ML inference.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-[#E63950] text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-[#E63950]" />
          <div>
            <strong className="block font-bold">Evaluation Error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Form or Result */}
      {result ? (
        <PredictionResult result={result} onNewPrediction={handleNewPrediction} />
      ) : (
        <PredictionForm onSubmit={handlePredict} loading={loading} />
      )}

    </div>
  );
};
