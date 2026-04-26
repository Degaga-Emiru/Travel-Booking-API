import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiExternalLink, FiSearch, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/payments', {
        params: { status: filterStatus }
      });
      setPayments(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction Logs</h1>
          <p className="text-sm text-gray-500">View and reconcile Chapa payment transactions.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Ref</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500">Loading transactions...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500">No transactions found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-mono text-xs">{payment.paymentIntentId || payment.paymentReference}</span>
                        <FiExternalLink className="ml-2 text-gray-400 cursor-pointer hover:text-blue-600" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">{payment.Booking?.bookingReference}</td>
                    <td className="px-6 py-4 font-bold">${payment.amount}</td>
                    <td className="px-6 py-4 capitalize">{payment.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase
                        ${payment.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                          payment.status === 'failed' ? 'bg-rose-50 text-rose-600' : 'bg-gray-50 text-gray-500'}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(payment.paymentDate).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
