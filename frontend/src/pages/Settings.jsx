import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiBell, FiCamera, FiSave, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, login } = useAuth(); // login function updates user context
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profileImage: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    newsletter: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/users/settings');
        const data = response.data.data;
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          address: data.address || '',
          profileImage: data.profileImage || '',
          notifications: data.preferences?.notifications ?? true,
          newsletter: data.preferences?.newsletter ?? false,
        }));
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put('/users/settings', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        profileImage: formData.profileImage,
        preferences: {
          notifications: formData.notifications,
          newsletter: formData.newsletter
        }
      });
      // Update local auth context if the response includes user data
      if (response.data.data) {
         // Optionally trigger context update here, assuming your auth context handles it
         const updatedToken = localStorage.getItem('token');
         if(updatedToken) login(response.data.data, updatedToken); 
      }
      showToast('Profile updated successfully!');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return showToast('Passwords do not match', 'error');
    }
    setIsLoading(true);
    try {
      await api.put('/users/settings', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      showToast('Password changed successfully!');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: <FiUser />, label: 'Profile' },
    { id: 'security', icon: <FiLock />, label: 'Security' },
    { id: 'notifications', icon: <FiBell />, label: 'Notifications' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Toast Notification */}
      {toast.show && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={`fixed top-24 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center space-x-3 text-white ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}
        >
          <FiCheckCircle size={20} />
          <span className="font-bold">{toast.message}</span>
        </motion.div>
      )}

      <h1 className="text-3xl font-black text-slate-900 mb-8">Account Settings</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-100">
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 bg-white">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              
              <div className="mb-8 flex items-center space-x-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden border-2 border-gray-100">
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiUser size={40} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Profile Image URL</label>
                  <input 
                    type="text" 
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Address</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl flex items-center space-x-2 hover:bg-primary-700 transition-all disabled:opacity-50"
                >
                  <FiSave />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
              <h2 className="text-2xl font-bold mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Current Password</label>
                  <input 
                    type="password" 
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center space-x-2 hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  <FiLock />
                  <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl">
              <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <h3 className="font-bold text-slate-900">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive alerts about your bookings and messages.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notifications" 
                      checked={formData.notifications} 
                      onChange={handleInputChange} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <h3 className="font-bold text-slate-900">Email Newsletter</h3>
                    <p className="text-sm text-gray-500">Receive weekly travel deals and updates.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="newsletter" 
                      checked={formData.newsletter} 
                      onChange={handleInputChange} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
                
                <button 
                  onClick={handleProfileSubmit}
                  disabled={isLoading}
                  className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl flex items-center space-x-2 hover:bg-primary-700 transition-all disabled:opacity-50"
                >
                  <FiSave />
                  <span>{isLoading ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
