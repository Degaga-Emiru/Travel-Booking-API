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
    ownerIdCard: '',
    licenseDocument: '',
    registrationDocument: '',
    bankAccountDetails: {
      bankName: '',
      accountNumber: '',
      accountHolderName: ''
    }
  });

  const [status, setStatus] = useState('pending_verification');
  const [isEditing, setIsEditing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/vendor/profile');
        if (response.data.success && response.data.data) {
          const profile = response.data.data;
          setStatus(profile.status || 'pending_verification');
          setRejectionReason(profile.rejectionReason || '');
          if (profile.status === 'rejected') setIsEditing(true);
          setFormData({
            companyName: profile.companyName || '',
            businessType: profile.businessType || 'Hotel',
            businessLicenseNumber: profile.businessLicenseNumber || '',
            taxId: profile.taxId || '',
            address: profile.address || '',
            contactPhone: profile.contactPhone || '',
            contactEmail: profile.contactEmail || '',
            ownerIdCard: profile.ownerIdCard || '',
            licenseDocument: profile.licenseDocument || '',
            registrationDocument: profile.registrationDocument || '',
            bankAccountDetails: profile.bankAccountDetails || {
              bankName: '',
              accountNumber: '',
              accountHolderName: ''
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/vendor/profile', { ...formData, status: 'pending_verification' });
      setStatus('pending_verification');
      setIsEditing(false);
      toast.success('Your business has been submitted for verification successfully.');
      
      setFormData({
        companyName: '',
        businessType: 'Hotel',
        businessLicenseNumber: '',
        taxId: '',
        address: '',
        contactPhone: '',
        contactEmail: '',
        ownerIdCard: '',
        licenseDocument: '',
        registrationDocument: '',
        bankAccountDetails: {
          bankName: '',
          accountNumber: '',
          accountHolderName: ''
        }
      });
    } catch (error) {
      toast.error('Failed to submit verification details');
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = (status === 'pending_verification' || status === 'verified') && !isEditing;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Verification</h1>
          <p className="text-gray-500 mt-2 font-medium">Verify your business to start listing services.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center ${
          status === 'verified' ? 'bg-emerald-50 text-emerald-600' :
          status === 'rejected' ? 'bg-rose-50 text-rose-600' :
          'bg-amber-50 text-amber-600'
        }`}>
          {status === 'verified' ? <FiCheckCircle className="mr-2" /> :
           status === 'rejected' ? <FiAlertCircle className="mr-2" /> :
           <FiInfo className="mr-2" />}
          {status === 'pending_verification' ? 'Pending Verification' : status}
        </div>
      </div>

      {status === 'verified' && (
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <FiCheckCircle className="text-emerald-500 text-2xl flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-emerald-900 font-black text-lg">Your business is verified!</h4>
              <p className="text-emerald-700 text-sm mt-1">You can now start adding your services to the platform.</p>
            </div>
          </div>
          <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-sm shrink-0 ml-4 hover:bg-emerald-200 transition-colors">
            Update Information
          </button>
        </div>
      )}

      {status === 'pending_verification' && (
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <FiInfo className="text-amber-500 text-2xl flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-amber-900 font-black text-lg">Verification Pending</h4>
              <p className="text-amber-700 text-sm mt-1">Your application is being reviewed. Please wait for the admin's approval.</p>
            </div>
          </div>
          <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-bold text-sm shrink-0 ml-4 hover:bg-amber-200 transition-colors">
            Update Information
          </button>
        </div>
      )}

      {status === 'rejected' && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <FiAlertCircle className="text-rose-500 text-2xl flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-rose-900 font-black text-lg">Verification Rejected</h4>
              <p className="text-rose-700 text-sm mt-1">Please review your documents and resubmit the form with correct information.</p>
              {rejectionReason && (
                <p className="text-rose-900 text-sm mt-2 font-bold bg-white/50 inline-block px-3 py-1 rounded-lg">Reason: {rejectionReason}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={isFormDisabled} className={`space-y-10 ${isFormDisabled ? 'opacity-70' : ''}`}>
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

        {/* Documents */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><FiUpload /></div>
             <h3 className="text-xl font-black text-slate-900">Document Uploads</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2 md:col-span-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner ID Card (URL)</label>
               <input type="url" placeholder="https://..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.ownerIdCard} onChange={e => setFormData({...formData, ownerIdCard: e.target.value})} required />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business License (URL)</label>
               <input type="url" placeholder="https://..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.licenseDocument} onChange={e => setFormData({...formData, licenseDocument: e.target.value})} required />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registration Document (URL)</label>
               <input type="url" placeholder="https://..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.registrationDocument} onChange={e => setFormData({...formData, registrationDocument: e.target.value})} required />
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

        {!isFormDisabled && (
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-slate-900/20 hover:bg-black transition-all active:scale-95"
          >
            {loading ? 'Submitting...' : 'Submit Verification Request'}
          </button>
        )}
        </fieldset>
      </form>
    </div>
  );
};

export default BusinessVerification;
