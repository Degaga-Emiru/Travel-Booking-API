import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiEye, FiDownload, FiInfo, FiTrendingUp } from 'react-icons/fi';
import api from '../../services/api';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

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

  const updateStatus = async (vendorId, newStatus) => {
    try {
      await api.patch(`/admin/vendors/${vendorId}/approve`, { status: newStatus });
      fetchVendors();
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
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
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
                        ${vendor.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                          vendor.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                          vendor.status === 'suspended' ? 'bg-rose-100 text-rose-600' :
                          'bg-gray-100 text-gray-600'}`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {vendor.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(vendor.id, 'approved')}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <FiCheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => updateStatus(vendor.id, 'rejected')}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FiXCircle size={18} />
                            </button>
                          </>
                        )}
                        <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="View Profile">
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
    </div>
  );
};

export default VendorManagement;
