import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RefundManagement = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [summary, setSummary] = useState({});

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/refunds', { params: { status: filterStatus || undefined } });
      setRefunds(response.data.data);
      setSummary(response.data.summary || {});
    } catch (error) {
      console.error('Failed to fetch refunds', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRefunds(); }, [filterStatus]);

  const handleAction = async (status) => {
    try {
      await api.patch(`/admin/refunds/${selectedRefund.id}`, { status, adminNotes });
      toast.success(`Refund ${status} successfully`);
      setShowModal(false);
      setSelectedRefund(null);
      setAdminNotes('');
      fetchRefunds();
    } catch (error) {
      toast.error('Failed to process refund');
    }
  };

  const openModal = (refund) => { setSelectedRefund(refund); setShowModal(true); };

  const statCards = [
    { label: 'Total Requests', value: summary.total || 0, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Pending', value: summary.pendingCount || 0, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Processed', value: summary.processedCount || 0, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Rejected', value: summary.rejectedCount || 0, color: '#EF4444', bg: '#FEF2F2' },
  ];

  const statusTabs = [
    { key: '', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'processed', label: 'Processed' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Refund Requests</h1>
        <p className="text-sm text-gray-500">Review and process refund requests from customers and vendors.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{card.label}</p>
            <p className="text-2xl font-extrabold mt-1" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-fit">
        {statusTabs.map(tab => (
          <button key={tab.key} onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${filterStatus === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">Loading refunds...</td></tr>
              ) : refunds.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">No refund requests found.</td></tr>
              ) : (
                refunds.map(refund => (
                  <tr key={refund.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 font-medium">{refund.Booking?.bookingReference}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold">{refund.User?.firstName} {refund.User?.lastName}</p>
                      <p className="text-xs text-gray-400">{refund.User?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">${refund.amount}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{refund.reason}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(refund.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                        ${refund.status === 'processed' ? 'bg-emerald-100 text-emerald-600' : 
                          refund.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                          refund.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500'}`}>
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {refund.status === 'pending' || refund.status === 'under_review' ? (
                        <button onClick={() => openModal(refund)} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">Review</button>
                      ) : (
                        <button className="p-2 text-gray-400 hover:text-gray-600"><FiInfo size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Review Refund</h2>
                <p className="text-sm text-gray-500 mt-1">Booking: {selectedRefund?.Booking?.bookingReference}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FiXCircle size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Requested By</p>
                  <p className="font-bold text-gray-900">{selectedRefund?.User?.firstName} {selectedRefund?.User?.lastName}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-xs text-blue-400 uppercase font-bold tracking-wider mb-1">Amount</p>
                  <p className="font-bold text-blue-700 text-xl">${selectedRefund?.amount}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Refund Reason</p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{selectedRefund?.reason}"</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Admin Notes</label>
                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="3"
                  placeholder="Explain the decision to the user..." value={adminNotes} onChange={e => setAdminNotes(e.target.value)}></textarea>
              </div>
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex space-x-4">
              <button onClick={() => handleAction('rejected')} className="flex-1 py-3 bg-white border border-rose-200 text-rose-600 rounded-2xl text-sm font-bold hover:bg-rose-50 transition-colors shadow-sm">Reject Request</button>
              <button onClick={() => handleAction('approved')} className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-xl shadow-emerald-900/20">Approve & Refund</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundManagement;
