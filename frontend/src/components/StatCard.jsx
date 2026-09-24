import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, trendColor = 'blue', subtitle }) => {
  const accentStyles = {
    blue: {
      iconBg: 'bg-[#E8F2FC] text-[#0B5CAD] border-[#D0E3F9]',
      badge: 'bg-[#E8F2FC] text-[#0B5CAD] border-[#D0E3F9]'
    },
    red: {
      iconBg: 'bg-[#FDF2F4] text-[#E63950] border-[#FAD4DA]',
      badge: 'bg-[#FDF2F4] text-[#E63950] border-[#FAD4DA]'
    },
    green: {
      iconBg: 'bg-[#EAF8F2] text-[#22A06B] border-[#C3EBD8]',
      badge: 'bg-[#EAF8F2] text-[#22A06B] border-[#C3EBD8]'
    },
    teal: {
      iconBg: 'bg-[#E8F7F6] text-[#0F9D9A] border-[#C4EFEF]',
      badge: 'bg-[#E8F7F6] text-[#0F9D9A] border-[#C4EFEF]'
    },
    amber: {
      iconBg: 'bg-[#FEF8E7] text-[#F59E0B] border-[#FDE8B3]',
      badge: 'bg-[#FEF8E7] text-[#F59E0B] border-[#FDE8B3]'
    }
  };

  const currentAccent = accentStyles[trendColor] || accentStyles.blue;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold text-[#172B4D] mt-1 tracking-tight">{value}</h3>
        </div>

        <div className={`p-2.5 rounded-xl border ${currentAccent.iconBg} shrink-0`}>
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between">
        {trend && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${currentAccent.badge}`}>
            {trend}
          </span>
        )}
        {subtitle && (
          <span className="text-[11px] font-medium text-[#64748B]">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
