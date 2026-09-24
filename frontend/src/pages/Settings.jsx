import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { settingsApi } from '../api/api';
import { Settings as SettingsIcon, User, Moon, LogOut, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: settingsData } = useApi(settingsApi.getSettings);
  const [savedMessage, setSavedMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Sarah Jenkins',
    email: user?.email || 'sarah.jenkins@cardio.ai',
    theme: 'medical_light',
    risk_alert_level: 'High',
    auto_save_predictions: true
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await settingsApi.updateSettings(formData);
      setSavedMessage('Settings updated successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      alert('Failed to update settings');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0B5CAD] uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">System Preferences</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Manage clinician account profile, healthcare UI theme, and local API parameters.
        </p>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-xl bg-[#EAF8F2] border border-[#C3EBD8] text-[#22A06B] text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#22A06B]" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Settings */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
            <User className="w-4 h-4 text-[#0B5CAD]" />
            <h3 className="font-bold text-[#172B4D] text-sm">Clinician Account Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F5F8FC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#172B4D] focus:border-[#0B5CAD]"
              />
            </div>
          </div>
        </div>

        {/* Application Aesthetics */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
            <Moon className="w-4 h-4 text-[#0F9D9A]" />
            <h3 className="font-bold text-[#172B4D] text-sm">Application Theme & Database Controls</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#172B4D] block">Interface Color Theme</span>
                <span className="text-[#64748B]">Current UI layout palette</span>
              </div>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="bg-[#F5F8FC] border border-[#E2E8F0] text-[#172B4D] rounded-lg px-3 py-1.5 focus:border-[#0B5CAD]"
              >
                <option value="medical_light">Medical Clinical Light (White + Deep Blue)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
              <div>
                <span className="font-semibold text-[#172B4D] block">Auto-Save Assessments</span>
                <span className="text-[#64748B]">Save predictions automatically to local SQLite database</span>
              </div>
              <input
                type="checkbox"
                checked={formData.auto_save_predictions}
                onChange={(e) => setFormData({ ...formData, auto_save_predictions: e.target.checked })}
                className="w-4 h-4 accent-[#0B5CAD] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save & Logout Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-[#FDF2F4] border border-[#FAD4DA] text-[#E63950] hover:bg-rose-100 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0B5CAD] hover:bg-[#08488A] text-white text-xs font-bold shadow-xs transition-all"
          >
            Save Preferences
          </button>
        </div>

      </form>

    </div>
  );
};
