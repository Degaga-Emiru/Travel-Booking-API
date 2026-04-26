import React, { useState } from 'react';
import { FiUpload, FiCheckCircle, FiAlertCircle, FiInfo, FiFileText, FiMapPin, FiCreditCard } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BusinessVerification = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    businessType: 'Hotel',
    businessLicenseNumber: '',
    taxId: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    bankAccountDetails: {
      bankName: '',
      accountNumber: '',
      accountHolderName: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/vendor/profile', formData);
      toast.success('Business verification details submitted!');
    } catch (error) {
      toast.error('Failed to submit verification details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Verification</h1>
          <p className="text-gray-500 mt-2 font-medium">Verify your business to start listing services.</p>
        </div>
        <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center">
          <FiAlertCircle className="mr-2" /> Pending Verification
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Business Info */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center"><FiFileText /></div>
            <h3 className="text-xl font-black text-slate-900">Business Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Legal Name</label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm"
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Type</label>
              <select 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm"
                value={formData.businessType}
                onChange={e => setFormData({...formData, businessType: e.target.value})}
              >
                <option>Hotel</option>
                <option>Airline</option>
                <option>Agency</option>
                <option>Car Rental</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">License Number</label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm"
                value={formData.businessLicenseNumber}
                onChange={e => setFormData({...formData, businessLicenseNumber: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tax ID (TIN)</label>
              <input 
                type="text" 
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm"
                value={formData.taxId}
                onChange={e => setFormData({...formData, taxId: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Contact & Address */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><FiMapPin /></div>
            <h3 className="text-xl font-black text-slate-900">Contact & Location</h3>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Business Address</label>
            <textarea 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-sm h-32"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Phone</label>
               <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Email</label>
               <input type="email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
             </div>
          </div>
        </div>

        {/* Banking Info */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
           <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><FiCreditCard /></div>
             <h3 className="text-xl font-black text-slate-900">Payout Details</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.bankAccountDetails.bankName} onChange={e => setFormData({...formData, bankAccountDetails: {...formData.bankAccountDetails, bankName: e.target.value}})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.bankAccountDetails.accountNumber} onChange={e => setFormData({...formData, bankAccountDetails: {...formData.bankAccountDetails, accountNumber: e.target.value}})} />
              </div>
           </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95"
        >
          {loading ? 'Submitting...' : 'Submit Verification Request'}
        </button>
      </form>
    </div>
  );
};

export default BusinessVerification;
