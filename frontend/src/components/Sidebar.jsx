import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Cpu, 
  BarChart3, 
  History, 
  Database, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Activity,
  Menu,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Risk Predictor', path: '/prediction', icon: Stethoscope },
    { name: 'ML Models', path: '/models', icon: Cpu },
    { name: 'Cardio Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Prediction History', path: '/history', icon: History },
    { name: 'Dataset Explorer', path: '/dataset', icon: Database },
  ];

  return (
    <>
      {/* Mobile Drawer Button */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2 bg-white border border-[#E2E8F0] rounded-xl text-[#0B5CAD] hover:bg-slate-50 shadow-sm"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-250 ease-in-out shadow-xs
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header Branding */}
        <div>
          <div className="h-20 flex items-center justify-between px-5 border-b border-[#E2E8F0]">
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-9 h-9 rounded-xl bg-[#E8F2FC] text-[#0B5CAD] flex items-center justify-center shrink-0 border border-[#D0E3F9]">
                <Heart className="w-5 h-5 fill-[#E63950] text-[#E63950] animate-pulse-subtle" />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="text-base font-bold text-[#172B4D] tracking-tight flex items-center gap-1">
                    Cardio<span className="text-[#0B5CAD]">AI</span>
                  </h1>
                  <p className="text-[11px] font-medium text-[#64748B]">Health Intelligence</p>
                </div>
              )}
            </div>
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#172B4D] hover:bg-slate-100 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 group relative
                    ${isActive 
                      ? 'bg-[#E8F2FC] text-[#0B5CAD] font-semibold shadow-2xs border-l-4 border-[#0B5CAD]' 
                      : 'text-[#64748B] hover:text-[#172B4D] hover:bg-slate-50 border-l-4 border-transparent'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Settings Section */}
        <div className="p-3 border-t border-[#E2E8F0] space-y-1">
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium text-xs transition-colors
              ${isActive ? 'bg-[#E8F2FC] text-[#0B5CAD] font-semibold' : 'text-[#64748B] hover:text-[#172B4D] hover:bg-slate-50'}
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          {/* User Profile Footer */}
          {!collapsed && user && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between mt-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-[#0B5CAD] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'DR'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-[#172B4D] truncate">{user.name || 'Dr. User'}</p>
                  <p className="text-[10px] text-[#64748B] truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-[#64748B] hover:text-[#E63950] hover:bg-white rounded-lg transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {collapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2 text-[#64748B] hover:text-[#E63950] hover:bg-slate-50 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
