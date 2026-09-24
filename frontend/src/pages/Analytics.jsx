import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { analyticsApi } from '../api/api';
import { ChartCard } from '../components/ChartCard';
import { Loading } from '../components/Loading';
import { BarChart3, Filter } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export const Analytics = () => {
  const { data: overview } = useApi(analyticsApi.getOverview);
  const { data: ageData, loading: ageLoading } = useApi(analyticsApi.getAgeDistribution);
  const { data: genderData } = useApi(analyticsApi.getGenderDistribution);
  const { data: bpData } = useApi(analyticsApi.getBpDistribution);
  const { data: lifestyleData } = useApi(analyticsApi.getLifestyleDistribution);

  const [genderFilter, setGenderFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All');

  if (ageLoading) return <Loading text="Loading Clinical Analytics..." />;

  const stats = overview || {
    total_user_predictions: 0,
    high_risk_predictions: 0,
    low_risk_predictions: 0,
    average_probability: 0.50,
    dataset_total_records: 70000,
    overall_disease_rate: 49.97
  };

  const ageChartData = ageData?.data || [];
  const genderChartData = genderData?.data || [];
  const bpChartData = bpData?.data || [];
  const lifestyleChartData = lifestyleData?.data || [];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0B5CAD] uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Population Insights</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172B4D] tracking-tight">Clinical Analytics</h1>
          <p className="text-xs text-[#64748B] mt-1">
            Explore cardiovascular risk patterns and patient population insights.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 bg-[#F5F8FC] p-2 rounded-xl border border-[#E2E8F0] shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#64748B] ml-1" />
          <select 
            value={genderFilter} 
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-white border border-[#E2E8F0] text-xs text-[#172B4D] rounded-lg px-2.5 py-1 focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          <select 
            value={ageFilter} 
            onChange={(e) => setAgeFilter(e.target.value)}
            className="bg-white border border-[#E2E8F0] text-xs text-[#172B4D] rounded-lg px-2.5 py-1 focus:outline-none"
          >
            <option value="All">All Age Groups</option>
            <option value="<40">&lt;40 yrs</option>
            <option value="40-49">40-49 yrs</option>
            <option value="50-59">50-59 yrs</option>
            <option value="60+">60+ yrs</option>
          </select>
        </div>
      </div>

      {/* Top Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-4 text-center shadow-xs">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase">Dataset Size</span>
          <p className="text-xl font-bold text-[#172B4D] mt-0.5">{stats.dataset_total_records.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-4 text-center shadow-xs">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase">Disease Rate</span>
          <p className="text-xl font-bold text-[#E63950] mt-0.5">{stats.overall_disease_rate}%</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-4 text-center shadow-xs">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase">User Predictions</span>
          <p className="text-xl font-bold text-[#0B5CAD] mt-0.5">{stats.total_user_predictions}</p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-4 text-center shadow-xs">
          <span className="text-[11px] font-semibold text-[#64748B] uppercase">Average Confidence</span>
          <p className="text-xl font-bold text-[#22A06B] mt-0.5">{(stats.average_probability * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Grid Row 1: Age & Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Age Group */}
        <ChartCard 
          title="Cardiovascular Disease by Age Group" 
          subtitle="Prevalence of disease across age cohorts"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ageChartData} margin={{ top: 20, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="age_group" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="low_risk" name="No Disease" fill="#22A06B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="high_risk" name="Cardio Disease" fill="#E63950" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gender Distribution */}
        <ChartCard 
          title="Risk Distribution by Gender" 
          subtitle="Comparative risk profile between female and male cohorts"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={genderChartData} margin={{ top: 20, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="gender" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="low_risk" name="Low Risk" fill="#0B5CAD" radius={[4, 4, 0, 0]} />
              <Bar dataKey="high_risk" name="High Risk" fill="#E63950" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* Grid Row 2: Blood Pressure & Lifestyle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Blood Pressure vs Disease Risk */}
        <ChartCard 
          title="Blood Pressure vs Disease Risk" 
          subtitle="Hypertension stage breakdown vs disease rate"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bpChartData} margin={{ top: 20, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="category" stroke="#64748B" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', fontSize: '12px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="low_risk" name="Low Risk" fill="#22A06B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="high_risk" name="High Risk" fill="#E63950" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Lifestyle vs Disease Risk */}
        <ChartCard 
          title="Lifestyle vs Disease Risk (%)" 
          subtitle="Impact of smoking, alcohol, and physical activity on disease rates"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={lifestyleChartData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis dataKey="group" type="category" stroke="#64748B" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', fontSize: '12px' }} />
              <Bar dataKey="disease_rate" name="Disease Rate %" fill="#0F9D9A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

    </div>
  );
};
