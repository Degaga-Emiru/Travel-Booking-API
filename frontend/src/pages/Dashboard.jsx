import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { bookingAPI } from '../services/booking';
import { FiCalendar, FiPackage, FiTrendingUp, FiUser, FiMapPin, FiCreditCard, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import BookingCard from '../components/booking/BookingCard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  const { data: bookingsData, isLoading: bookingsLoading, refetch } = useQuery({
    queryKey: ['userBookings'],
    queryFn: () => bookingAPI.getUserBookings({ limit: 50 }),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['bookingStats'],
    queryFn: () => bookingAPI.getStats(),
  });

  if (bookingsLoading || statsLoading) return <LoadingSpinner />;

  const allBookings = bookingsData?.data?.data || [];
  
  const filteredBookings = allBookings.filter(b => {
    if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (activeTab === 'past') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const stats = [
    { title: 'Trips', value: statsData?.data?.data?.total || 0, icon: <FiCalendar />, color: 'bg-blue-500' },
    { title: 'Confirmed', value: statsData?.data?.data?.byStatus?.confirmed || 0, icon: <FiCheckCircle />, color: 'bg-emerald-500' },
    { title: 'Pending', value: statsData?.data?.data?.byStatus?.pending || 0, icon: <FiClock />, color: 'bg-amber-500' },
    { title: 'Spent', value: `$${statsData?.data?.data?.totalRevenue || 0}`, icon: <FiCreditCard />, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Hello, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Ready for your next adventure?</p>
          </motion.div>
          <div className="flex items-center space-x-3">
             <Link to="/hotels" className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:scale-105 transition-all">Book New Trip</Link>
             <button onClick={logout} className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"><FiXCircle className="text-rose-500" /></button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.title}</p>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
              </div>
              <div className={`w-12 h-12 ${s.color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg`}>
                {s.icon}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Booking Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-2xl w-fit">
              {['upcoming', 'past', 'cancelled'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onUpdate={refetch} />
                ))
              ) : (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiPackage className="text-gray-300 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No {activeTab} bookings</h3>
                  <p className="text-gray-500 mt-2">Looks like it's time to plan your next trip!</p>
                  <Link to="/hotels" className="mt-8 inline-block px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-900/20">Explore Hotels</Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Travel Profile Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 -z-0 opacity-50"></div>
              <div className="relative z-10 flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                  {user?.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-gray-900">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">Gold Member</p>
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Email</span>
                  <span className="text-gray-900 font-bold">{user?.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Points</span>
                  <span className="text-emerald-600 font-black">2,450 XP</span>
                </div>
              </div>
              <Link to="/profile" className="mt-8 block text-center py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">Edit Profile</Link>
            </div>

            {/* Support Widget */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Need help?</h3>
              <p className="text-sm text-white/60 mb-8 leading-relaxed">Our travel experts are available 24/7 to assist with your bookings.</p>
              <button className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/30">Start Chat</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;