import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiBell } from 'react-icons/fi';
import api from '../../services/api';
import NotificationDrawer from './NotificationDrawer';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      if (!isAuthenticated) return;
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/cities', label: 'Explore Destinations' },
    { path: '/hotels', label: 'Hotels' },
    { path: '/flights', label: 'Flights' },
  ];

  if (isAuthenticated) {
    navLinks.push({ path: '/bookings', label: 'My Bookings' });
  }

  const getHeaderStyles = () => {
    if (user?.role === 'admin') return 'bg-slate-900 border-slate-800 text-white';
    if (user?.role === 'vendor') return 'bg-indigo-900 border-indigo-800 text-white';
    return 'bg-white border-gray-200';
  };

  const getLogoStyles = () => {
    if (user?.role === 'admin') return 'bg-amber-500';
    if (user?.role === 'vendor') return 'bg-emerald-500';
    return 'bg-primary-500';
  };

  return (
    <header className={`${getHeaderStyles()} shadow-lg border-b sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`${getLogoStyles()} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="text-white font-black text-lg">TB</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-tight ${user?.role === 'admin' || user?.role === 'vendor' ? 'text-white' : 'text-slate-900'}`}>
                TravelBooking
              </span>
              {user?.role === 'admin' && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest -mt-1">Administration</span>}
              {user?.role === 'vendor' && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest -mt-1">Vendor Portal</span>}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-tight transition-all hover:opacity-70 ${
                  isActiveLink(link.path) 
                    ? (user?.role === 'admin' || user?.role === 'vendor' ? 'text-white border-b-2 border-white pb-1' : 'text-primary-600')
                    : (user?.role === 'admin' || user?.role === 'vendor' ? 'text-gray-300' : 'text-gray-600')
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center space-x-3 rounded-2xl px-4 py-2 transition-all duration-200 border ${
                    user?.role === 'admin' || user?.role === 'vendor' 
                      ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                      : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-9 h-9 ${getLogoStyles()} rounded-xl flex items-center justify-center shadow-inner`}>
                    <span className="text-white text-xs font-black uppercase">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <span className={`hidden sm:block text-sm font-black ${user?.role === 'admin' || user?.role === 'vendor' ? 'text-white' : 'text-slate-700'}`}>
                    {user?.firstName}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiSettings className="mr-3 text-blue-600" />
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === 'vendor' && (
                      <Link
                        to="/vendor"
                        className="flex items-center px-4 py-2 text-sm text-primary-600 font-bold hover:bg-primary-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiSettings className="mr-3 text-primary-600" />
                        Vendor Hub
                      </Link>
                    )}
                    {user?.role !== 'admin' && user?.role !== 'vendor' && (
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiUser className="mr-3" />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <FiUser className="mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <FiSettings className="mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative group">
                <button 
                  onClick={() => setIsNotifOpen(true)}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all relative"
                >
                  <FiBell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActiveLink(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-md text-base font-medium text-white bg-primary-500 hover:bg-primary-600 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
      <NotificationDrawer 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        onNotificationsRead={() => setUnreadCount(prev => Math.max(0, prev - 1))}
        onMarkAllRead={() => setUnreadCount(0)}
      />
    </header>
  );
};

export default Header;