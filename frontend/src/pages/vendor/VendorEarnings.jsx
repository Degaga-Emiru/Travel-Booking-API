import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiDollarSign, FiClock, FiCheckCircle, FiArrowRight, FiCreditCard, FiArrowDown } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const VendorEarnings = () => {
  const queryClient = useQueryClient();
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['vendorStats'],
    queryFn: async () => {
      const response = await api.get('/vendor/stats');
      return response.data.data;
    }
  });

  const payoutMutation = useMutation({
    mutationFn: async (data) => {
      await api.post('/vendor/payouts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorStats']);
      toast.success('Payout request submitted!');
      setShowPayoutModal(false);
      setPayoutAmount('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Payout failed');
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Earnings & Payouts</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your revenue and request bank transfers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Balance Card */}
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full -mr-32 -mt-32 opacity-10"></div>
           <div className="relative z-10 space-y-10">
              <div>
                 <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Available Balance</p>
                 <h2 className="text-6xl font-black tracking-tight">${statsData?.stats?.payoutBalance || '0.00'}</h2>
              </div>
              <div className="grid grid-cols-2 gap-10">
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Revenue</p>
                    <p className="text-2xl font-black">${statsData?.stats?.totalRevenue || '0.00'}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Commission Rate</p>
                    <p className="text-2xl font-black">10.0%</p>
                 </div>
              </div>
              <button 
                onClick={() => setShowPayoutModal(true)}
                className="w-full py-5 bg-primary-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
              >
                 Request Payout <FiArrowRight className="ml-2" />
              </button>
           </div>
        </div>

        {/* Info Card */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-between">
           <div className="space-y-6">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center text-3xl"><FiCreditCard /></div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Payout Information</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Payouts are processed within 3-5 business days. Your registered bank account will be used for all transfers.</p>
           </div>
           <div className="mt-10 p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Next Scheduled Payout</p>
              <p className="text-center font-black text-slate-900">May 15, 2026</p>
           </div>
        </div>
      </div>

      {/* Transaction History Placeholder */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
            <button className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline">View All</button>
         </div>
         <div className="p-10 text-center">
            <FiArrowDown className="text-gray-200 text-6xl mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900">No transactions yet</h3>
            <p className="text-gray-500 mt-2">When you complete bookings or receive payouts, they will be listed here.</p>
         </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl"
            >
               <h3 className="text-2xl font-black text-slate-900 mb-2 text-center">Request Payout</h3>
               <p className="text-sm text-gray-500 text-center mb-8">Enter the amount you wish to withdraw to your bank account.</p>
               
               <div className="space-y-6">
                  <div className="relative">
                     <FiDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                     <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full py-5 pl-14 pr-6 bg-gray-50 border-none rounded-[1.5rem] text-3xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                     />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-2">
                     <span className="text-gray-400">Available: ${statsData?.stats?.payoutBalance}</span>
                     <button onClick={() => setPayoutAmount(statsData?.stats?.payoutBalance)} className="text-primary-600 hover:underline">Use Max</button>
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button onClick={() => setShowPayoutModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold">Cancel</button>
                     <button 
                       onClick={() => payoutMutation.mutate({ amount: payoutAmount, bankName: 'CBE', accountNumber: '1000...', accountHolderName: 'Vendor' })}
                       className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg"
                     >
                        Confirm Payout
                     </button>
                  </div>
               </div>
            </motion.div>
         </div>
      )}
    </div>
  );
};

export default VendorEarnings;
