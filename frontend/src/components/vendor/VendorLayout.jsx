import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, FiBriefcase, FiPlusCircle, FiCalendar, 
  FiBarChart2, FiMessageCircle, FiSettings, FiLogOut, FiMenu, FiX, FiSend, FiTruck, FiBox
} from 'react-icons/fi';

const VendorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/vendor/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/vendor/verification', icon: <FiBriefcase />, label: 'Verification' },
    { path: '/vendor/bookings', icon: <FiCalendar />, label: 'Bookings' },
    { path: '/vendor/hotels', icon: <FiBox />, label: 'My Hotels' },
    { path: '/vendor/flights', icon: <FiSend />, label: 'My Flights' },
    { path: '/vendor/cars', icon: <FiTruck />, label: 'My Cars' },
    { path: '/vendor/earnings', icon: <FiBarChart2 />, label: 'Earnings' },
    { path: '/vendor/chat', icon: <FiMessageCircle />, label: 'Messages' },
    { path: '/vendor/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/vendor/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold">V</div>
              <span className="text-xl font-black tracking-tight uppercase">Vendor Hub</span>
            </Link>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><FiX size={24} /></button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4 px-2">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-primary-500">
                {user?.firstName?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest">Agency Owner</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all font-bold text-sm">
              <FiLogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 z-10">
          <div className="flex items-center">
            <button className="p-2 mr-4 text-gray-600 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <FiMenu size={24} />
            </button>
            <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight">
              {menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Status</p>
              <div className="flex items-center space-x-1.5 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase">Verified Business</span>
              </div>
            </div>
            <button className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-slate-900 hover:bg-gray-100 transition-all">
              <FiSettings />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VendorLayout;
