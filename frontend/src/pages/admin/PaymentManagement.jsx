import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiExternalLink, FiDollarSign, FiClock, FiXCircle, FiRefreshCw, FiDownload } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({});

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/payments', { params: { status: filterStatus, page, limit: 10 } });
      setPayments(response.data.data);
      setTotalPages(response.data.totalPages);
      setSummary(response.data.summary || {});
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [filterStatus, page]);

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/payments/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'payments_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Payment data exported');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: `$${(summary.totalRevenue || 0).toLocaleString()}`, icon: <FiDollarSign />, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Completed', value: summary.completedCount || 0, icon: <FiCreditCard />, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Pending', value: summary.pendingCount || 0, icon: <FiClock />, color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Failed', value: summary.failedCount || 0, icon: <FiXCircle />, color: '#EF4444', bg: '#FEF2F2' },
    { label: 'Refunded', value: summary.refundedCount || 0, icon: <FiRefreshCw />, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Logs</h1>
          <p className="text-sm text-gray-500">View and reconcile Chapa payment transactions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <FiDownload size={14} /><span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{card.label}</p>
              <p className="text-lg font-extrabold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Ref</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-500">Loading transactions...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-500">No transactions found.</td></tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs">{payment.paymentIntentId || payment.paymentReference}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{payment.Booking?.bookingReference}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{payment.User?.firstName} {payment.User?.lastName}</p>
                      <p className="text-xs text-gray-400">{payment.User?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold">${payment.amount}</td>
                    <td className="px-6 py-4 capitalize">{payment.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase
                        ${payment.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                          payment.status === 'failed' ? 'bg-rose-50 text-rose-600' :
                          payment.status === 'refunded' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-500'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(payment.paymentDate).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
