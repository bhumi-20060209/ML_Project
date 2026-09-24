import React, { useState, useEffect } from 'react';
import { predictionApi } from '../api/api';
import { DataTable } from '../components/DataTable';
import { History, Eye, Trash2, AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const PredictionHistory = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const [selectedPred, setSelectedPred] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await predictionApi.getHistory({
        page,
        per_page: 10,
        search,
        risk: riskFilter
      });
      setData(response.data.predictions);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, riskFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await predictionApi.deletePrediction(deleteId);
      setDeleteId(null);
      fetchHistory();
    } catch (err) {
      alert("Failed to delete record: " + err.message);
    }
  };

  const columns = [
    {
      header: 'Prediction ID',
      accessor: 'id',
      render: (row) => <span className="font-mono text-[#0B5CAD] font-bold">#PRD-{row.id}</span>
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => <span className="text-[#172B4D] font-medium">{row.created_at || 'Just now'}</span>
    },
    {
      header: 'Age / Gender',
      accessor: 'age',
      render: (row) => <span className="font-semibold text-[#172B4D]">{row.age}y ({row.gender})</span>
    },
    {
      header: 'Blood Pressure',
      accessor: 'ap_hi',
      render: (row) => <span>{row.ap_hi} / {row.ap_lo} mmHg</span>
    },
    {
      header: 'Cholesterol',
      accessor: 'cholesterol',
      render: (row) => <span>Level {row.cholesterol}</span>
    },
    {
      header: 'Risk Level',
      accessor: 'prediction',
      render: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
          row.prediction === 1 
            ? 'bg-[#FDF2F4] text-[#E63950] border-[#FAD4DA]' 
            : 'bg-[#EAF8F2] text-[#22A06B] border-[#C3EBD8]'
        }`}>
          {row.risk_label}
        </span>
      )
    },
    {
      header: 'Probability',
      accessor: 'probability',
      render: (row) => <span className="font-bold text-[#172B4D]">{(row.probability * 100).toFixed(1)}%</span>
    },
    {
      header: 'Model',
      accessor: 'model_used',
      render: () => <span className="text-[#64748B] text-[11px]">Random Forest</span>
    },
    {
      header: 'Action',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedPred(row)}
            className="p-1.5 rounded-lg bg-slate-100 text-[#0B5CAD] hover:bg-[#E8F2FC] transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 rounded-lg bg-slate-100 text-[#E63950] hover:bg-[#FDF2F4] transition-colors"
            title="Delete Record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B5CAD] uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>SQLite Patient Logs</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">Prediction History</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Historical medical evaluation records stored in local database (`cardio.db`).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
            className="bg-[#F5F8FC] border border-[#E2E8F0] text-xs text-[#172B4D] rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="">All Risk Levels</option>
            <option value="high">HIGH RISK Only</option>
            <option value="low">LOW RISK Only</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={data}
        totalRows={total}
        currentPage={page}
        totalPages={pages}
        onPageChange={(p) => setPage(p)}
        loading={loading}
        emptyTitle="No Predictions Found"
        emptyDescription="Run a new assessment on the Risk Predictor page to save clinical records in SQLite."
      />

      {/* View Detail Modal */}
      {selectedPred && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 max-w-lg w-full shadow-lg space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#0B5CAD] font-bold text-sm">#PRD-{selectedPred.id}</span>
                <span className="text-xs font-semibold text-[#64748B]">Patient Details</span>
              </div>
              <button 
                onClick={() => setSelectedPred(null)}
                className="p-1 text-[#64748B] hover:text-[#172B4D] rounded-lg bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              selectedPred.prediction === 1 
                ? 'bg-[#FDF2F4] border-[#FAD4DA] text-[#E63950]' 
                : 'bg-[#EAF8F2] border-[#C3EBD8] text-[#22A06B]'
            }`}>
              <div className="flex items-center gap-3">
                {selectedPred.prediction === 1 ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                <div>
                  <h4 className="font-bold text-sm">{selectedPred.risk_label}</h4>
                  <p className="text-xs text-[#172B4D]">{(selectedPred.probability * 100).toFixed(1)}% Probability</p>
                </div>
              </div>
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block font-semibold">Age & Gender</span>
                <span className="font-bold text-[#172B4D]">{selectedPred.age} yrs ({selectedPred.gender})</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block font-semibold">Height & Weight</span>
                <span className="font-bold text-[#172B4D]">{selectedPred.height} cm / {selectedPred.weight} kg</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block font-semibold">Blood Pressure</span>
                <span className="font-bold text-[#172B4D]">{selectedPred.ap_hi} / {selectedPred.ap_lo} mmHg</span>
              </div>
              <div className="p-3 rounded-lg bg-[#F5F8FC] border border-[#E2E8F0]">
                <span className="text-[10px] text-[#64748B] uppercase block font-semibold">BMI Index</span>
                <span className="font-bold text-[#172B4D]">{selectedPred.bmi} kg/m²</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPred(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-[#172B4D] hover:bg-slate-200"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 max-w-sm w-full shadow-lg space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FDF2F4] border border-[#FAD4DA] text-[#E63950] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-[#172B4D] text-sm">Delete Record #PRD-{deleteId}?</h3>
              <p className="text-xs text-[#64748B] mt-1">This action will remove the record from SQLite.</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-[#64748B] text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-[#E63950] text-white text-xs font-bold hover:bg-[#be123c]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
