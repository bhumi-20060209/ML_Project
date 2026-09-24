import React from 'react';
import { HeartPulse } from 'lucide-react';

export const Loading = ({ text = "Loading clinical intelligence..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-teal-400 animate-spin"></div>
        <HeartPulse className="w-5 h-5 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-xs font-semibold text-slate-400 animate-pulse">{text}</p>
    </div>
  );
};
