import React, { useState } from 'react';
import { User, Activity, Heart, RotateCcw, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { getBpStatus, getBmiCategory } from '../utils/formatters';

export const PredictionForm = ({ onSubmit, loading }) => {
  const initialData = {
    age: 50,
    gender: 1, // 1: Female, 2: Male
    height: 165,
    weight: 68,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1, // 1: Normal, 2: Above Normal, 3: Well Above Normal
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1,
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : parseInt(value, 10);
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    if (!formData.height || formData.height < 120 || formData.height > 220) {
      newErrors.height = 'Height must be between 120 cm and 220 cm';
    }
    if (!formData.weight || formData.weight < 30 || formData.weight > 200) {
      newErrors.weight = 'Weight must be between 30 kg and 200 kg';
    }
    if (!formData.ap_hi || formData.ap_hi < 60 || formData.ap_hi > 240) {
      newErrors.ap_hi = 'Systolic BP must be between 60 and 240';
    }
    if (!formData.ap_lo || formData.ap_lo < 40 || formData.ap_lo > 160) {
      newErrors.ap_lo = 'Diastolic BP must be between 40 and 160';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setErrors({});
  };

  const calculatedBmi = formData.height > 0 ? (formData.weight / ((formData.height / 100) ** 2)) : 0;
  const bmiBadge = getBmiCategory(calculatedBmi);
  const bpBadge = getBpStatus(formData.ap_hi, formData.ap_lo);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Personal Information */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
            <div className="p-2 rounded-lg bg-[#E8F2FC] text-[#0B5CAD]">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#172B4D] text-sm">1. Personal Information</h3>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Age (Years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
              />
              {errors.age && <p className="text-[11px] text-[#E63950] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
              >
                <option value={1}>Female (1)</option>
                <option value={2}>Male (2)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="120"
                  max="220"
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
                />
                {errors.height && <p className="text-[11px] text-[#E63950] mt-1">{errors.height}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="30"
                  max="200"
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
                />
                {errors.weight && <p className="text-[11px] text-[#E63950] mt-1">{errors.weight}</p>}
              </div>
            </div>

            {/* Calculated BMI */}
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#64748B] block">Body Mass Index (BMI)</span>
                  <span className="text-sm font-bold text-[#0B5CAD]">{calculatedBmi.toFixed(1)} kg/m²</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F2FC] text-[#0B5CAD] border border-[#D0E3F9]">
                  {bmiBadge.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Blood Pressure & Health Indicators */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
            <div className="p-2 rounded-lg bg-[#E8F7F6] text-[#0F9D9A]">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#172B4D] text-sm">2. Blood Pressure & Labs</h3>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Systolic BP (ap_hi)</label>
                <input
                  type="number"
                  name="ap_hi"
                  value={formData.ap_hi}
                  onChange={handleChange}
                  min="60"
                  max="240"
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
                />
                {errors.ap_hi && <p className="text-[11px] text-[#E63950] mt-1">{errors.ap_hi}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Diastolic BP (ap_lo)</label>
                <input
                  type="number"
                  name="ap_lo"
                  value={formData.ap_lo}
                  onChange={handleChange}
                  min="40"
                  max="160"
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
                />
                {errors.ap_lo && <p className="text-[11px] text-[#E63950] mt-1">{errors.ap_lo}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Cholesterol Level</label>
              <select
                name="cholesterol"
                value={formData.cholesterol}
                onChange={handleChange}
                className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
              >
                <option value={1}>1: Normal</option>
                <option value={2}>2: Above Normal</option>
                <option value={3}>3: Well Above Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Glucose Level</label>
              <select
                name="gluc"
                value={formData.gluc}
                onChange={handleChange}
                className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
              >
                <option value={1}>1: Normal</option>
                <option value={2}>2: Above Normal</option>
                <option value={3}>3: Well Above Normal</option>
              </select>
            </div>

            {/* Live BP Badge */}
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-[#F5F8FC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#64748B] block">Blood Pressure Category</span>
                  <span className="text-xs font-bold text-[#172B4D]">{formData.ap_hi} / {formData.ap_lo} mmHg</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F7F6] text-[#0F9D9A] border border-[#C4EFEF]">
                  {bpBadge.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Lifestyle Factors & Action Buttons */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9] mb-4">
              <div className="p-2 rounded-lg bg-[#EAF8F2] text-[#22A06B]">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#172B4D] text-sm">3. Lifestyle Factors</h3>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Smoking Habit</label>
                <select
                  name="smoke"
                  value={formData.smoke}
                  onChange={handleChange}
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
                >
                  <option value={0}>Non-Smoker (0)</option>
                  <option value={1}>Smoker (1)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Alcohol Consumption</label>
                <select
                  name="alco"
                  value={formData.alco}
                  onChange={handleChange}
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
                >
                  <option value={0}>No Alcohol Intake (0)</option>
                  <option value={1}>Consumes Alcohol (1)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Physical Activity</label>
                <select
                  name="active"
                  value={formData.active}
                  onChange={handleChange}
                  className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD] focus:bg-white transition-all"
                >
                  <option value={1}>Physically Active (1)</option>
                  <option value={0}>Inactive / Sedentary (0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#64748B] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#E2E8F0] disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-5 rounded-xl bg-[#0B5CAD] hover:bg-[#08488A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Evaluating Risk...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Predict Cardiovascular Risk</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </form>
  );
};
