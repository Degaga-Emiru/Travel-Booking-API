import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiEye, FiDownload, FiInfo, FiTrendingUp } from 'react-icons/fi';
import api from '../../services/api';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/vendors', {
        params: { status: filterStatus }
      });
      setVendors(response.data.data);
    } catch (error) {
      console.error('Failed to fetch vendors', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [filterStatus]);

  const updateStatus = async (vendorId, newStatus, rejectionReason = null) => {
    try {
      await api.patch(`/admin/vendors/${vendorId}/approve`, { status: newStatus, rejectionReason });
      fetchVendors();
      if (selectedVendor && selectedVendor.id === vendorId) {
        setSelectedVendor(null);
      }
    } catch (error) {
      alert('Failed to update vendor status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-sm text-gray-500">Approve registrations and monitor travel agency performance.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Applications</option>
            <option value="pending_verification">Pending Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white p-20 rounded-2xl border border-gray-100 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">Analyzing vendor database...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="bg-white p-20 rounded-2xl border border-gray-100 text-center text-gray-500">
            No vendor applications found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{vendor.companyName}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">ID: {vendor.id.substring(0, 8)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{vendor.User?.firstName} {vendor.User?.lastName}</p>
                      <p className="text-xs text-gray-500">{vendor.User?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Bookings</p>
                          <p className="text-sm font-bold text-gray-900">{vendor.totalBookings}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">Revenue</p>
                          <p className="text-sm font-bold text-emerald-600">${vendor.totalRevenue?.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${vendor.status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 
                          vendor.status === 'pending_verification' ? 'bg-amber-100 text-amber-600' : 
                          vendor.status === 'suspended' ? 'bg-rose-100 text-rose-600' :
                          'bg-gray-100 text-gray-600'}`}
                      >
                        {vendor.status === 'pending_verification' ? 'Pending' : vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {vendor.status === 'pending_verification' && (
                          <>
                            <button 
                              onClick={() => updateStatus(vendor.id, 'verified')}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Verify"
                            >
                              <FiCheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                const reason = window.prompt("Enter optional rejection reason:");
                                if (reason !== null) updateStatus(vendor.id, 'rejected', reason);
                              }}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FiXCircle size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
                          title="View Profile"
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          <FiEye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{selectedVendor.companyName}</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Application Details</p>
              </div>
              <button 
                onClick={() => setSelectedVendor(null)}
                className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Business Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Type</p>
                  <p className="font-bold text-gray-900">{selectedVendor.businessType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">License Number</p>
                  <p className="font-bold text-gray-900">{selectedVendor.businessLicenseNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tax ID</p>
                  <p className="font-bold text-gray-900">{selectedVendor.taxId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block mt-1
                        ${selectedVendor.status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 
                          selectedVendor.status === 'pending_verification' ? 'bg-amber-100 text-amber-600' : 
                          selectedVendor.status === 'suspended' ? 'bg-rose-100 text-rose-600' :
                          'bg-gray-100 text-gray-600'}`}
                      >
                        {selectedVendor.status === 'pending_verification' ? 'Pending' : selectedVendor.status}
                  </span>
                </div>
                {selectedVendor.status === 'rejected' && selectedVendor.rejectionReason && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rejection Reason</p>
                    <p className="font-bold text-rose-600">{selectedVendor.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-2">Submitted Documents</h3>
                
                {selectedVendor.ownerIdCard && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Owner ID Card</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-md">{selectedVendor.ownerIdCard}</p>
                    </div>
                    <a href={selectedVendor.ownerIdCard} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 text-sm font-bold hover:underline bg-blue-50 px-4 py-2 rounded-xl">
                      <FiEye className="mr-2" /> View
                    </a>
                  </div>
                )}
                
                {selectedVendor.licenseDocument && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Business License</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-md">{selectedVendor.licenseDocument}</p>
                    </div>
                    <a href={selectedVendor.licenseDocument} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 text-sm font-bold hover:underline bg-blue-50 px-4 py-2 rounded-xl">
                      <FiEye className="mr-2" /> View
                    </a>
                  </div>
                )}
                
                {selectedVendor.registrationDocument && (
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Registration Document</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-md">{selectedVendor.registrationDocument}</p>
                    </div>
                    <a href={selectedVendor.registrationDocument} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 text-sm font-bold hover:underline bg-blue-50 px-4 py-2 rounded-xl">
                      <FiEye className="mr-2" /> View
                    </a>
                  </div>
                )}
                
                {!selectedVendor.ownerIdCard && !selectedVendor.licenseDocument && !selectedVendor.registrationDocument && (
                  <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-2xl text-center">No documents submitted.</p>
                )}
              </div>

              {/* Actions */}
              {selectedVendor.status === 'pending_verification' && (
                <div className="flex space-x-4 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => updateStatus(selectedVendor.id, 'verified')}
                    className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex justify-center items-center"
                  >
                    <FiCheckCircle className="mr-2" /> Verify Vendor
                  </button>
                  <button 
                    onClick={() => {
                        const reason = window.prompt("Enter optional rejection reason:");
                        if (reason !== null) updateStatus(selectedVendor.id, 'rejected', reason);
                    }}
                    className="flex-1 bg-rose-50 text-rose-600 font-bold py-4 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors flex justify-center items-center"
                  >
                    <FiXCircle className="mr-2" /> Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
