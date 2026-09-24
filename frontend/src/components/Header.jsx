import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Heart, ChevronDown, LogOut, Settings, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Header = ({ title = "Dashboard", subtitle = "Cardiovascular Health Intelligence" }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Breadcrumbs & Page Name */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B] mb-0.5">
          <span>CardioAI</span>
          <span>/</span>
          <span className="text-[#0B5CAD] font-semibold">{title}</span>
        </div>
        <h1 className="text-base sm:text-lg font-bold text-[#172B4D] tracking-tight">{title}</h1>
      </div>

      {/* Right: Controls & Status */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search record, patient ID..."
            className="w-56 lg:w-64 bg-[#F5F8FC] border border-[#E2E8F0] text-xs text-[#172B4D] pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-[#0B5CAD] transition-all placeholder:text-[#94A3B8]"
          />
        </div>

        {/* System Status Indicator: ● Cardio Engine Active */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF8F2] border border-[#22A06B]/30 text-[#22A06B] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#22A06B] animate-pulse"></span>
          <span>Cardio Engine Active</span>
        </div>

        {/* Notification Icon */}
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0B5CAD]"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3.5 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">Notifications</h4>
                <span className="text-[10px] bg-[#E8F2FC] text-[#0B5CAD] px-2 py-0.5 rounded-full font-bold">2 System</span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0]">
                  <p className="font-semibold text-[#172B4D]">Random Forest Classifier Loaded</p>
                  <p className="text-[#64748B] text-[11px] mt-0.5">Trained model active for cardiovascular risk inference.</p>
                </div>
                <div className="p-2 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0]">
                  <p className="font-semibold text-[#172B4D]">SQLite Database Connected</p>
                  <p className="text-[#64748B] text-[11px] mt-0.5">Prediction records persisted in local database.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-slate-50 border border-[#E2E8F0] hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-7 h-7 rounded-md bg-[#0B5CAD] text-white font-bold flex items-center justify-center text-xs">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'DR'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-[#172B4D] leading-tight">{user?.name || 'Dr. User'}</p>
              <p className="text-[10px] text-[#64748B]">Clinician</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-[#E2E8F0]">
                <p className="text-xs font-semibold text-[#172B4D]">{user?.name || 'Dr. User'}</p>
                <p className="text-[10px] text-[#64748B] truncate">{user?.email}</p>
              </div>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-[#64748B] hover:bg-slate-50 hover:text-[#172B4D] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Settings</span>
              </Link>
              <button
                onClick={() => { setDropdownOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#E63950] hover:bg-rose-50 transition-colors border-t border-[#E2E8F0] mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
