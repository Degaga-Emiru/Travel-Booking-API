import React, { useState } from 'react';
import { FiSave, FiGlobe, FiDollarSign, FiBell, FiShield, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Travel Booking Platform',
    baseCommission: 10,
    allowVendorRegistration: true,
    enableRefunds: true,
    maintenanceMode: false,
    primaryCurrency: 'USD'
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500">Configure global platform behavior and financial parameters.</p>
      </div>

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
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Primary Currency</label>
                <select 
                  value={settings.primaryCurrency}
                  onChange={(e) => handleChange('primaryCurrency', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900">Base Commission Rate</p>
                  <p className="text-xs text-gray-500">Default percentage taken from each vendor booking</p>
                </div>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={settings.baseCommission}
                    onChange={(e) => handleChange('baseCommission', e.target.value)}
                    className="w-20 bg-white border border-gray-200 rounded-lg p-2 text-sm text-center mr-2 font-bold"
                  />
                  <span className="font-bold text-gray-400">%</span>
                </div>
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
                <div key={feature.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer" onClick={() => handleChange(feature.id, !settings[feature.id])}>
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
            <h3 className="font-bold text-xl mb-4">Save Changes</h3>
            <p className="text-sm text-blue-100 mb-6">Updating these settings will affect all users across the platform immediately.</p>
            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors">
              <FiSave />
              <span>Apply Configuration</span>
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <FiBell className="mr-2" /> Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="text-xs text-gray-500 border-l-2 border-blue-500 pl-4 py-1">
                <p className="font-bold text-gray-900">Commission Updated</p>
                <p>Changed from 8% to 10% by Admin</p>
                <p className="mt-1 opacity-60">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
