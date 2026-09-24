import React from 'react';

export const ChartCard = ({ title, subtitle, children, action }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
        <div>
          <h3 className="font-bold text-[#172B4D] text-sm tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="w-full flex-1 min-h-[260px]">
        {children}
      </div>
    </div>
  );
};
