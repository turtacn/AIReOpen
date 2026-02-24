import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDashboardStats, type DashboardStats } from '../../services/api';

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div className="p-4">Loading...</div>;

  const data = [
    { name: t('dashboard.consumed'), tokens: stats.totalTokensConsumed },
    { name: t('dashboard.saved'), tokens: stats.totalTokensSaved },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('nav.dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">{t('dashboard.cacheHitRate')}</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.cacheHitRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">{t('dashboard.costSaved')}</h3>
          <p className="text-3xl font-bold text-green-600">${stats.costSavedUSD}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">{t('dashboard.activeChannels')}</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.activeChannels}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500">{t('dashboard.totalTokens')}</h3>
          <p className="text-3xl font-bold text-slate-700">{(stats.totalTokensConsumed + stats.totalTokensSaved).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 h-96">
        <h2 className="text-lg font-semibold mb-4">{t('dashboard.tokenUsage')}</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tokens" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
