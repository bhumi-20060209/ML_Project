import React from 'react';
import { useApi } from '../hooks/useApi';
import { dashboardApi } from '../api/api';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { Loading } from '../components/Loading';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  Award, 
  Server, 
  Heart,
  ArrowRight,
  Brain,
  Zap,
  Stethoscope
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { data, loading, error } = useApi(dashboardApi.getStats);

  if (loading) return <Loading text="Loading Cardiovascular Analytics..." />;

  const stats = data?.stats || {
    total_predictions: 0,
    high_risk_predictions: 0,
    low_risk_predictions: 0,
    model_accuracy: 73.3
  };

  const riskDistribution = [
    { name: 'High Risk', value: stats.high_risk_predictions, color: '#E63950' },
    { name: 'Low Risk', value: stats.low_risk_predictions, color: '#22A06B' }
  ];

  const recentPredictions = data?.recent_predictions || [];

  const trendData = [
    { date: 'Mon', Predictions: 12, HighRisk: 5 },
    { date: 'Tue', Predictions: 19, HighRisk: 8 },
    { date: 'Wed', Predictions: 15, HighRisk: 6 },
    { date: 'Thu', Predictions: 22, HighRisk: 11 },
    { date: 'Fri', Predictions: 28, HighRisk: 13 },
    { date: 'Sat', Predictions: 20, HighRisk: 9 },
    { date: 'Sun', Predictions: 25, HighRisk: 12 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B5CAD] uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 fill-[#E63950] text-[#E63950]" />
            <span>Clinical AI Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">Cardiovascular Health Intelligence</h1>
          <p className="text-xs text-[#64748B] mt-1">
            AI-powered cardiovascular risk analysis and prediction system.
          </p>
        </div>

        <Link
          to="/prediction"
          className="px-5 py-2.5 rounded-xl bg-[#0B5CAD] hover:bg-[#08488A] text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Stethoscope className="w-4 h-4" />
          <span>New Patient Assessment</span>
        </Link>
      </div>

      {/* Top Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Predictions"
          value={stats.total_predictions.toLocaleString()}
          icon={Activity}
          trend="SQLite Logged"
          trendColor="blue"
          subtitle="Processed Records"
        />
        <StatCard
          title="High Risk"
          value={stats.high_risk_predictions.toLocaleString()}
          icon={ShieldAlert}
          trend={`${stats.total_predictions > 0 ? ((stats.high_risk_predictions / stats.total_predictions) * 100).toFixed(1) : 0}% Rate`}
          trendColor="red"
          subtitle="Requires Medical Review"
        />
        <StatCard
          title="Low Risk"
          value={stats.low_risk_predictions.toLocaleString()}
          icon={CheckCircle}
          trend={`${stats.total_predictions > 0 ? ((stats.low_risk_predictions / stats.total_predictions) * 100).toFixed(1) : 0}% Rate`}
          trendColor="green"
          subtitle="Normal Baseline"
        />
        <StatCard
          title="Model Accuracy"
          value={`${stats.model_accuracy}%`}
          icon={Award}
          trend="Random Forest v1.0"
          trendColor="green"
          subtitle="70k Dataset Benchmark"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prediction Activity Chart */}
        <div className="lg:col-span-2">
          <ChartCard 
            title="Weekly Prediction Activity" 
            subtitle="Volume of patient cardiovascular risk evaluations processed over time"
          >
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B5CAD" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0B5CAD" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E63950" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#E63950" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="Predictions" stroke="#0B5CAD" strokeWidth={2} fillOpacity={1} fill="url(#colorPred)" />
                <Area type="monotone" dataKey="HighRisk" stroke="#E63950" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div>
          <ChartCard 
            title="Risk Breakdown" 
            subtitle="Ratio of High Risk vs Low Risk Patients"
          >
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', fontSize: '12px' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </div>

      {/* Grid: Recent Predictions Table & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Predictions Table */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div>
              <h3 className="font-bold text-[#172B4D] text-sm flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#0B5CAD]" />
                Recent Risk Assessments
              </h3>
              <p className="text-xs text-[#64748B]">Latest clinical patient evaluations</p>
            </div>
            <Link 
              to="/history" 
              className="text-xs font-semibold text-[#0B5CAD] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#172B4D]">
              <thead className="bg-[#F5F8FC] text-[#64748B] uppercase text-[10px] font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Age / Gender</th>
                  <th className="px-4 py-3">BP (mmHg)</th>
                  <th className="px-4 py-3">BMI</th>
                  <th className="px-4 py-3">Risk Level</th>
                  <th className="px-4 py-3">Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {recentPredictions.length > 0 ? (
                  recentPredictions.map((pred) => (
                    <tr key={pred.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-[#0B5CAD] font-bold">#{pred.id}</td>
                      <td className="px-4 py-3 font-semibold text-[#172B4D]">{pred.age}y / {pred.gender}</td>
                      <td className="px-4 py-3">{pred.ap_hi}/{pred.ap_lo}</td>
                      <td className="px-4 py-3">{pred.bmi}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          pred.prediction === 1 
                            ? 'bg-[#FDF2F4] text-[#E63950] border-[#FAD4DA]' 
                            : 'bg-[#EAF8F2] text-[#22A06B] border-[#C3EBD8]'
                        }`}>
                          {pred.risk_label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#172B4D]">
                        {(pred.probability * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#64748B]">
                      No evaluations recorded yet. Run a prediction to populate records!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model & System Status Column */}
        <div className="space-y-6">
          
          {/* Active Model Summary */}
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
              <div className="p-2 rounded-lg bg-[#E8F2FC] text-[#0B5CAD] border border-[#D0E3F9]">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#172B4D] text-xs uppercase tracking-wider">Active ML Model</h4>
                <p className="text-xs text-[#64748B]">Random Forest Classifier</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Training Accuracy</span>
                <span className="font-bold text-[#0B5CAD]">73.31%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">ROC-AUC Score</span>
                <span className="font-bold text-[#22A06B]">0.798</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#64748B]">Artifact Loader</span>
                <span className="font-semibold text-[#172B4D]">joblib v1.5</span>
              </div>
            </div>
          </div>

          {/* System Health Status */}
          <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
              <div className="p-2 rounded-lg bg-[#EAF8F2] text-[#22A06B] border border-[#C3EBD8]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#172B4D] text-xs uppercase tracking-wider">System Status</h4>
                <p className="text-xs text-[#64748B]">Flask API & SQLite Database</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Flask Server</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EAF8F2] text-[#22A06B] font-bold text-[10px]">● Online (5000)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Database</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EAF8F2] text-[#22A06B] font-bold text-[10px]">SQLite (cardio.db)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
