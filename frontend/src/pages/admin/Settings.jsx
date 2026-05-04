import React, { useState, useEffect } from 'react';
import { FiSave, FiGlobe, FiDollarSign, FiBell, FiShield, FiToggleLeft, FiToggleRight, FiUser, FiLock, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();

  // Profile state
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '', address: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // System settings state
  const [settings, setSettings] = useState({
    siteName: 'Travel Booking Platform',
    baseCommission: 10,
    allowVendorRegistration: true,
    enableRefunds: true,
    maintenanceMode: false,
    primaryCurrency: 'USD'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/admin/profile');
        const data = response.data.data;
        setProfile({ firstName: data.firstName || '', lastName: data.lastName || '', phone: data.phone || '', address: data.address || '' });
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const payload = { ...profile };
      if (passwords.newPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          toast.error('Passwords do not match');
          setSaving(false);
          return;
        }
        if (!passwords.currentPassword) {
          toast.error('Current password is required');
          setSaving(false);
          return;
        }
        payload.currentPassword = passwords.currentPassword;
        payload.newPassword = passwords.newPassword;
      }
      await api.put('/admin/profile', payload);
      toast.success('Profile updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile and configure global platform behavior.</p>
      </div>

      {/* ====== PROFILE SECTION ====== */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-extrabold text-white shadow-lg">
              {profile.firstName?.charAt(0) || 'A'}{profile.lastName?.charAt(0) || ''}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile.firstName} {profile.lastName}</h2>
              <p className="text-blue-200 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase rounded-full tracking-wider">System Administrator</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center"><FiUser className="mr-2 text-blue-600" /> Profile Information</h3>
          
          {profileLoading ? (
            <div className="text-center py-8 text-gray-400">Loading profile...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">First Name</label>
                  <input type="text" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Last Name</label>
                  <input type="text" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Phone</label>
                  <input type="text" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+251 9xx xxx xxx" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Address</label>
                  <input type="text" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="City, Country" />
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center mb-4"><FiLock className="mr-2 text-purple-600" /> Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Current Password</label>
                    <input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">New Password</label>
                    <input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Confirm Password</label>
                    <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleProfileSave} disabled={saving}
                  className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiCheck />}
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ====== SYSTEM SETTINGS ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <FiGlobe className="mr-2 text-blue-600" /> General Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Platform Name</label>
                <input type="text" value={settings.siteName} onChange={e => handleSettingChange('siteName', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Primary Currency</label>
                <select value={settings.primaryCurrency} onChange={e => handleSettingChange('primaryCurrency', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="USD">USD - US Dollar</option>
                  <option value="ETB">ETB - Ethiopian Birr</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <FiDollarSign className="mr-2 text-emerald-600" /> Financial Parameters
            </h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-bold text-gray-900">Base Commission Rate</p>
                <p className="text-xs text-gray-500">Default percentage taken from each vendor booking</p>
              </div>
              <div className="flex items-center">
                <input type="number" value={settings.baseCommission} onChange={e => handleSettingChange('baseCommission', e.target.value)}
                  className="w-20 bg-white border border-gray-200 rounded-lg p-2 text-sm text-center mr-2 font-bold" />
                <span className="font-bold text-gray-400">%</span>
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <FiShield className="mr-2 text-purple-600" /> Feature Management
            </h2>
            <div className="space-y-4">
              {[
                { id: 'allowVendorRegistration', label: 'Allow Vendor Registration', desc: 'Enable new travel agencies to apply' },
                { id: 'enableRefunds', label: 'Enable Automatic Refunds', desc: 'Allow users to request refunds via dashboard' },
                { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Disable all customer-facing features' }
              ].map(feature => (
                <div key={feature.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer" onClick={() => handleSettingChange(feature.id, !settings[feature.id])}>
                  <div>
                    <p className="font-bold text-gray-900">{feature.label}</p>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                  <div className={`text-3xl ${settings[feature.id] ? 'text-blue-600' : 'text-gray-300'}`}>
                    {settings[feature.id] ? <FiToggleRight /> : <FiToggleLeft />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-900/20 text-white">
            <h3 className="font-bold text-xl mb-4">Save Settings</h3>
            <p className="text-sm text-blue-100 mb-6">Updating these settings will affect all users across the platform immediately.</p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors">
              <FiSave /><span>Apply Configuration</span>
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <FiBell className="mr-2" /> Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="text-xs text-gray-500 border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-bold text-gray-900">Profile Updated</p>
                <p>Admin profile was modified</p>
                <p className="mt-1 opacity-60">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
