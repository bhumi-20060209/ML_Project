import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { datasetApi } from '../api/api';
import { DataTable } from '../components/DataTable';
import { Loading } from '../components/Loading';
import { Database, Table, BarChart2, Layers } from 'lucide-react';

export const Dataset = () => {
  const { data: summary } = useApi(datasetApi.getSummary);
  const { data: columnsData, loading: colsLoading } = useApi(datasetApi.getColumns);
  const { data: statsData } = useApi(datasetApi.getStatistics);

  const [samplePage, setSamplePage] = useState(1);
  const { data: sampleData, loading: sampleLoading } = useApi(
    () => datasetApi.getSample({ page: samplePage, per_page: 10 }),
    true,
    samplePage
  );

  const [activeTab, setActiveTab] = useState('sample');

  if (colsLoading) return <Loading text="Loading dataset explorer..." />;

  const summaryInfo = summary || {
    dataset_name: 'cardio_train.csv',
    total_rows: 70000,
    total_columns: 13,
    target_column: 'cardio',
    file_size_kb: 2872,
    delimiter: ';'
  };

  const columnsList = columnsData?.columns || [];
  const statisticsList = statsData?.statistics || [];

  const sampleColumns = [
    { header: 'ID', accessor: 'id', render: (row) => <span className="font-mono text-[#0B5CAD]">#{row.id}</span> },
    { header: 'Age (y)', accessor: 'age_years', render: (row) => <span>{row.age_years}</span> },
    { header: 'Gender', accessor: 'gender', render: (row) => <span>{row.gender === 1 ? 'Female (1)' : 'Male (2)'}</span> },
    { header: 'Height', accessor: 'height', render: (row) => <span>{row.height} cm</span> },
    { header: 'Weight', accessor: 'weight', render: (row) => <span>{row.weight} kg</span> },
    { header: 'BP', accessor: 'ap_hi', render: (row) => <span>{row.ap_hi}/{row.ap_lo}</span> },
    { header: 'Cholesterol', accessor: 'cholesterol' },
    { header: 'Glucose', accessor: 'gluc' },
    { header: 'Smoke', accessor: 'smoke' },
    { header: 'Active', accessor: 'active' },
    { 
      header: 'Cardio Target', 
      accessor: 'cardio',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          row.cardio === 1 
            ? 'bg-[#FDF2F4] text-[#E63950] border-[#FAD4DA]' 
            : 'bg-[#EAF8F2] text-[#22A06B] border-[#C3EBD8]'
        }`}>
          {row.cardio === 1 ? 'Positive (1)' : 'Negative (0)'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B5CAD] uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Dataset Exploration</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">Dataset Explorer</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Safe read-only analysis of cardio_train.csv dataset metadata and statistical distribution.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="flex items-center gap-3 bg-[#F5F8FC] p-2.5 rounded-xl border border-[#E2E8F0] text-xs shrink-0">
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Total Records</span>
            <span className="font-bold text-[#0B5CAD] text-sm">{summaryInfo.total_rows.toLocaleString()}</span>
          </div>
          <div className="h-5 w-px bg-[#E2E8F0]"></div>
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Features</span>
            <span className="font-bold text-[#172B4D] text-sm">{summaryInfo.total_columns}</span>
          </div>
          <div className="h-5 w-px bg-[#E2E8F0]"></div>
          <div>
            <span className="text-[10px] text-[#64748B] block uppercase font-semibold">Target</span>
            <span className="font-bold text-[#22A06B] text-sm">{summaryInfo.target_column}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab('sample')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'sample' ? 'bg-[#E8F2FC] text-[#0B5CAD] border border-[#D0E3F9]' : 'text-[#64748B] hover:text-[#172B4D]'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Sample Records</span>
        </button>
        <button
          onClick={() => setActiveTab('columns')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'columns' ? 'bg-[#E8F2FC] text-[#0B5CAD] border border-[#D0E3F9]' : 'text-[#64748B] hover:text-[#172B4D]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Dataset Columns</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'stats' ? 'bg-[#E8F2FC] text-[#0B5CAD] border border-[#D0E3F9]' : 'text-[#64748B] hover:text-[#172B4D]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Data Statistics</span>
        </button>
      </div>

      {/* Tab 1: Sample Records */}
      {activeTab === 'sample' && (
        <DataTable
          columns={sampleColumns}
          data={sampleData?.data || []}
          totalRows={sampleData?.total_rows || 70000}
          currentPage={sampleData?.current_page || 1}
          totalPages={sampleData?.total_pages || 4667}
          onPageChange={(p) => setSamplePage(p)}
          loading={sampleLoading}
        />
      )}

      {/* Tab 2: Columns Dictionary */}
      {activeTab === 'columns' && (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-[#172B4D] text-sm">Feature Schema & Data Types</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#172B4D]">
              <thead className="bg-[#F5F8FC] text-[#64748B] uppercase text-[10px] font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3">Feature Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Sample Values</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {columnsList.map((col, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-[#0B5CAD] font-mono">{col.name}</td>
                    <td className="px-4 py-3 text-[#64748B]">{col.data_type}</td>
                    <td className="px-4 py-3 text-[#172B4D]">{col.description}</td>
                    <td className="px-4 py-3 text-[#64748B] font-mono">{col.sample_values.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Descriptive Statistics */}
      {activeTab === 'stats' && (
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-[#172B4D] text-sm">Descriptive Dataset Statistics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#172B4D]">
              <thead className="bg-[#F5F8FC] text-[#64748B] uppercase text-[10px] font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Count</th>
                  <th className="px-4 py-3">Mean</th>
                  <th className="px-4 py-3">Std Dev</th>
                  <th className="px-4 py-3">Min</th>
                  <th className="px-4 py-3">25%</th>
                  <th className="px-4 py-3">50% (Median)</th>
                  <th className="px-4 py-3">75%</th>
                  <th className="px-4 py-3">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] font-mono">
                {statisticsList.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-[#0B5CAD]">{row.feature}</td>
                    <td className="px-4 py-3">{row.count}</td>
                    <td className="px-4 py-3 font-bold text-[#172B4D]">{row.mean}</td>
                    <td className="px-4 py-3 text-[#64748B]">{row.std}</td>
                    <td className="px-4 py-3">{row.min}</td>
                    <td className="px-4 py-3">{row.q25}</td>
                    <td className="px-4 py-3 text-[#0F9D9A] font-bold">{row.median}</td>
                    <td className="px-4 py-3">{row.q75}</td>
                    <td className="px-4 py-3 text-[#E63950]">{row.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
