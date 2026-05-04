import React, { useState, useEffect } from 'react';
import { 
  FiUsers, FiBriefcase, FiShoppingBag, FiDollarSign, FiTrendingUp, FiActivity,
  FiArrowUpRight, FiArrowDownRight, FiAlertCircle, FiMapPin, FiNavigation, FiHome as FiHotel, FiTruck
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StatCard = ({ title, value, icon, trend, color, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-gray-900">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl`} style={{ background: `${color}15`, color: color }}>
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend !== undefined && (
        trend >= 0 ? (
          <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <FiArrowUpRight className="mr-1" /> {trend}%
          </span>
        ) : (
          <span className="flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
            <FiArrowDownRight className="mr-1" /> {Math.abs(trend)}%
          </span>
        )
      )}
      <span className="text-xs text-gray-400 ml-2 font-medium">vs last month</span>
    </div>
  </div>
);

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const chartData = {
    labels: (stats?.revenueChart || []).map(d => d.label),
    datasets: [
      {
        label: 'Revenue',
        data: (stats?.revenueChart || []).map(d => d.total),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3B82F6',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `Revenue: $${context.parsed.y.toLocaleString()}`
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } }
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { 
          color: '#94a3b8', 
          font: { size: 11 },
          callback: (value) => `$${value}`
        },
        beginAtZero: true
      },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back, Admin. Here's what's happening on your platform today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<FiUsers size={24} />}
          trend={stats?.growth?.users ?? 0} color="#3B82F6" subtitle="Active customers & vendors" />
        <StatCard title="Active Vendors" value={stats?.totalVendors || 0} icon={<FiBriefcase size={24} />}
          trend={stats?.growth?.vendors ?? 0} color="#10B981" subtitle={`${stats?.pendingVendors || 0} pending applications`} />
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon={<FiShoppingBag size={24} />}
          trend={stats?.growth?.bookings ?? 0} color="#8B5CF6" subtitle="Flights, Hotels, Packages" />
        <StatCard title="Total Revenue" value={`$${(stats?.totalRevenue || 0).toLocaleString()}`} icon={<FiDollarSign size={24} />}
          trend={stats?.growth?.revenue ?? 0} color="#F59E0B" subtitle="Completed payments" />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Pending Refunds" value={stats?.pendingRefunds || 0} icon={<FiAlertCircle size={24} />}
          trend={undefined} color="#EF4444" subtitle="Awaiting review" />
        <StatCard title="Active Services" value={(stats?.totalFlights || 0) + (stats?.totalHotels || 0) + (stats?.totalCars || 0)} icon={<FiMapPin size={24} />}
          trend={undefined} color="#06B6D4" subtitle={`${stats?.totalFlights || 0} flights · ${stats?.totalHotels || 0} hotels · ${stats?.totalCars || 0} cars`} />
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">Booking Breakdown</p>
            <div className="mt-3 space-y-2">
              {[
                { label: 'Flights', count: stats?.bookingBreakdown?.flights || 0, icon: <FiNavigation size={14} /> },
                { label: 'Hotels', count: stats?.bookingBreakdown?.hotels || 0, icon: <FiHotel size={14} /> },
                { label: 'Packages', count: stats?.bookingBreakdown?.packages || 0, icon: <FiTruck size={14} /> },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-blue-100">{item.icon} {item.label}</span>
                  <span className="font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue (Last 7 Days)</h2>
          </div>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-xl p-6 text-white">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => navigate('/admin/bookings')} className="w-full py-3 px-5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl flex items-center space-x-3 text-sm">
                <FiShoppingBag /><span className="font-semibold">Manage Bookings</span>
              </button>
              <button onClick={() => navigate('/admin/refunds')} className="w-full py-3 px-5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl flex items-center space-x-3 text-sm">
                <FiAlertCircle /><span className="font-semibold">Review Refunds ({stats?.pendingRefunds || 0})</span>
              </button>
              <button onClick={() => navigate('/admin/vendors')} className="w-full py-3 px-5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl flex items-center space-x-3 text-sm">
                <FiBriefcase /><span className="font-semibold">Pending Vendors ({stats?.pendingVendors || 0})</span>
              </button>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center"><FiActivity className="mr-2 text-blue-600" /> Recent Bookings</h3>
            <div className="space-y-3">
              {(stats?.recentBookings || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No bookings yet</p>
              ) : (
                stats.recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between text-sm border-l-2 border-blue-500 pl-3 py-1">
                    <div>
                      <p className="font-bold text-gray-900">{b.bookingReference}</p>
                      <p className="text-xs text-gray-400">{b.User?.firstName} {b.User?.lastName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-700">${parseFloat(b.totalAmount).toLocaleString()}</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
                        ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : b.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
