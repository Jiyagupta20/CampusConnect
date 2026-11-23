import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import StatCard from '../../components/StatCard.jsx';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  Download, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Building,
  TrendingUp
} from 'lucide-react';

const AdminAnalytics = () => {
  const { showToast } = useNotification();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.analytics.get();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportCSV = async () => {
    try {
      showToast('Exporting complaints analytics data...', 'info');
      await api.complaints.exportCSV();
      showToast('CSV Exported successfully!', 'success');
    } catch (e) {
      showToast('Failed to export CSV', 'error');
    }
  };

  if (loading) {
    return <LoadingSkeleton count={4} height="240px" />;
  }

  const { stats, statusDistribution, categoryData, departmentData, monthlyTrend } = data || {};

  const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#06b6d4', '#ec4899'];

  return (
    <div>
      <div className="module-header-actions">
        <div>
          <h1 className="welcome-title">Reports & Campus Analytics</h1>
          <p className="welcome-subtitle">
            Visual metrics, resolution velocity, departmental issue breakdowns, and monthly operational trends.
          </p>
        </div>
        <button onClick={handleExportCSV} className="btn btn-primary">
          <Download size={16} /> Export Comprehensive CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid" style={{ marginBottom: '28px' }}>
        <StatCard
          title="Total Complaints"
          value={stats?.totalComplaints || 0}
          icon={BarChart3}
          meta="Historical volume"
          color="var(--primary)"
          bgLight="var(--primary-light)"
        />
        <StatCard
          title="Average Resolution SLA"
          value={stats?.avgResolutionHours || '24 hrs'}
          icon={Activity}
          meta="Turnaround speed"
          color="var(--status-resolved)"
          bgLight="var(--status-resolved-bg)"
        />
        <StatCard
          title="Resolution Rate"
          value={
            stats?.totalComplaints > 0 
              ? `${Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%` 
              : '85%'
          }
          icon={CheckCircle2}
          meta="Tickets closed"
          color="#8b5cf6"
          bgLight="rgba(139, 92, 246, 0.15)"
        />
        <StatCard
          title="Active Backlog"
          value={stats?.pendingComplaints || 0}
          icon={Clock}
          meta="Awaiting technician action"
          color="var(--status-submitted)"
          bgLight="var(--status-submitted-bg)"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="analytics-grid-2">
        {/* Chart 1: Monthly Trend (Total vs Resolved) */}
        <div className="chart-card">
          <h3 className="chart-card-title">
            <TrendingUp size={18} style={{ display: 'inline', marginRight: '8px', color: 'var(--primary)' }} />
            Monthly Issue Inflow vs. Resolution Velocity
          </h3>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Legend />
                <Area type="monotone" dataKey="total" name="Complaints Logged" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="resolved" name="Resolved Tickets" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Complaints by Status (Donut Chart) */}
        <div className="chart-card">
          <h3 className="chart-card-title">
            <Activity size={18} style={{ display: 'inline', marginRight: '8px', color: 'var(--status-progress)' }} />
            Complaints Status Distribution
          </h3>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="analytics-grid-2">
        {/* Chart 3: Category Breakdown (Bar Chart) */}
        <div className="chart-card">
          <h3 className="chart-card-title">
            <BarChart3 size={18} style={{ display: 'inline', marginRight: '8px', color: 'var(--primary)' }} />
            Issues by Category
          </h3>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Total Issues" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Department-wise Complaints */}
        <div className="chart-card">
          <h3 className="chart-card-title">
            <Building size={18} style={{ display: 'inline', marginRight: '8px', color: 'var(--status-submitted)' }} />
            Department-wise Complaints Volume
          </h3>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                <Bar dataKey="count" name="Complaints" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

