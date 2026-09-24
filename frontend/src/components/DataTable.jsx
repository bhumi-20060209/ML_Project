import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns,
  data,
  totalRows,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSearch,
  searchValue = '',
  loading = false,
  emptyTitle = 'No Records Found',
  emptyDescription = 'There are no items to display right now.'
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[14px] shadow-xs overflow-hidden flex flex-col justify-between">
      
      {/* Search Bar */}
      {onSearch && (
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 bg-[#F5F8FC]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search record ID, patient indicators..."
              className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#172B4D] focus:outline-none focus:border-[#0B5CAD] transition-all placeholder:text-[#94A3B8]"
            />
          </div>
          {totalRows !== undefined && (
            <span className="text-xs font-medium text-[#64748B]">
              Total Records: <strong className="text-[#0B5CAD] font-bold">{totalRows}</strong>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-xs text-[#172B4D]">
          <thead className="bg-[#F5F8FC] text-[#64748B] uppercase tracking-wider text-[10px] font-bold border-b border-[#E2E8F0]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F5F9]">
            {loading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-4 py-3.5">
                      <div className="h-3.5 bg-slate-100 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data && data.length > 0 ? (
              data.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="p-3 border-t border-[#E2E8F0] flex items-center justify-between bg-[#F5F8FC] text-xs">
          <span className="text-[#64748B]">
            Page <strong className="text-[#172B4D] font-bold">{currentPage}</strong> of <strong className="text-[#172B4D] font-bold">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#172B4D] disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#172B4D] disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
