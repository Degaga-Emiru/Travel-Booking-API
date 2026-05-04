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

const VendorDashboard = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['vendorStats'],
    queryFn: async () => {
      const response = await api.get('/vendor/stats');
      return response.data.data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  const stats = [
    { label: 'Total Earnings', value: `$${parseFloat(statsData?.stats?.totalRevenue || 0).toLocaleString()}`, icon: <FiDollarSign />, color: 'bg-emerald-500' },
    { label: 'Pending Payout', value: `$${parseFloat(statsData?.stats?.payoutBalance || 0).toLocaleString()}`, icon: <FiClock />, color: 'bg-amber-500' },
    { label: 'Total Bookings', value: statsData?.stats?.totalBookings || '0', icon: <FiShoppingBag />, color: 'bg-primary-500' },
    { label: 'Average Rating', value: statsData?.stats?.rating || '5.0', icon: <FiStar />, color: 'bg-indigo-500' },
  ];

  const chartData = {
    labels: (statsData?.revenueChart || []).map(d => d.label),
    datasets: [
      {
        label: 'Revenue',
        data: (statsData?.revenueChart || []).map(d => d.total),
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: '#6366F1',
        pointBackgroundColor: '#6366F1',
        pointBorderColor: '#fff',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        callbacks: {
          label: (context) => `Revenue: $${context.parsed.y.toLocaleString()}`
        }
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11 }, callback: (v) => `$${v}` }, beginAtZero: true },
    },
  };

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Overview</h1>
        <p className="text-gray-500 mt-2 font-medium">Monitor your performance and manage your travel services.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] -mr-8 -mt-8 rounded-full`}></div>
            <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-6`}>
              {stat.icon}
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Analytics</h3>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 7 Days</div>
           </div>
           <div className="h-64">
              <Line data={chartData} options={chartOptions} />
           </div>
        </div>

        {/* Action Center */}
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full -mr-32 -mt-32 opacity-10"></div>
           <h3 className="text-2xl font-black mb-4 relative z-10">Verification Status</h3>
           <div className="flex items-center space-x-3 mb-10 relative z-10">
              <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40"></div>
              <span className="font-bold text-emerald-400">Your business is verified!</span>
           </div>
           
           <div className="space-y-4 relative z-10">
              <p className="text-white/60 text-sm leading-relaxed mb-6">Start listing your hotels, flights, or car rentals to reach thousands of travelers.</p>
              <div className="grid grid-cols-2 gap-4">
                 <button className="bg-white/10 hover:bg-white/20 p-6 rounded-3xl text-left transition-all group">
                    <FiCheckCircle className="text-primary-400 mb-4 text-2xl group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-sm">Add Hotel</p>
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 p-6 rounded-3xl text-left transition-all group">
                    <FiCheckCircle className="text-primary-400 mb-4 text-2xl group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-sm">Add Flight</p>
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
