import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiBriefcase, 
  FiShoppingBag, 
  FiDollarSign, 
  FiTrendingUp,
  FiActivity,
  FiArrowUpRight,
  FiArrowDownRight
} from 'react-icons/fi';
import api from '../../services/api';

const StatCard = ({ title, value, icon, trend, color, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend > 0 ? (
        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <FiArrowUpRight className="mr-1" /> {trend}%
        </span>
      ) : (
        <span className="flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
          <FiArrowDownRight className="mr-1" /> {Math.abs(trend)}%
        </span>
      )}
      <span className="text-xs text-gray-400 ml-2 font-medium">vs last month</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back, Admin. Here's what's happening on your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={<FiUsers size={24} />} 
          trend={12} 
          color="blue"
          subtitle="Active customers & vendors"
        />
        <StatCard 
          title="Active Vendors" 
          value={stats?.totalVendors || 0} 
          icon={<FiBriefcase size={24} />} 
          trend={5} 
          color="emerald"
          subtitle={`${stats?.pendingVendors || 0} applications pending`}
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings || 0} 
          icon={<FiShoppingBag size={24} />} 
          trend={-2} 
          color="purple"
          subtitle="Flights, Hotels, Packages"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} 
          icon={<FiDollarSign size={24} />} 
          trend={18} 
          color="amber"
          subtitle="Successfully processed via Chapa"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue Growth</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg">Last 7 Days</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-lg">Last 30 Days</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2 px-4">
            {/* Simple CSS Chart placeholder */}
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  className="bg-blue-500/20 group-hover:bg-blue-500/40 transition-colors rounded-t-lg w-full" 
                  style={{ height: `${h}%` }}
                ></div>
                <div 
                  className="absolute bottom-0 bg-blue-600 rounded-t-lg w-full" 
                  style={{ height: `${h * 0.6}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-gray-400 px-4">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-xl p-8 text-white">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-xl"><FiTrendingUp /></div>
              <div className="text-left">
                <p className="font-bold">Generate Report</p>
                <p className="text-xs text-indigo-100">Download monthly performance</p>
              </div>
            </button>
            <button className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-xl"><FiActivity /></div>
              <div className="text-left">
                <p className="font-bold">System Health</p>
                <p className="text-xs text-indigo-100">View real-time server logs</p>
              </div>
            </button>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm font-medium text-indigo-200 mb-4">PLATFORM TIPS</p>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-sm italic">"Review pending vendor applications once a day to maintain listing quality."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
