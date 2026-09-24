import React from 'react';
import { Database, FileQuestion } from 'lucide-react';

export const EmptyState = ({ title = "No Data Found", description = "There are no items to display at this moment.", action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500 flex items-center justify-center">
        <FileQuestion className="w-7 h-7" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400 max-w-sm mt-1">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
