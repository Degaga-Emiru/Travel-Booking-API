import React, { useState, useEffect } from 'react';
import { FiX, FiBell, FiCheckCircle, FiInfo, FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotificationDrawer = ({ isOpen, onClose, onNotificationsRead, onMarkAllRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      if (onMarkAllRead) onMarkAllRead();
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking_update': return <FiCheckCircle className="text-emerald-500" />;
      case 'payment': return <FiInfo className="text-blue-500" />;
      case 'alert': return <FiAlertCircle className="text-rose-500" />;
      default: return <FiBell className="text-primary-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" onClick={onClose} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center space-x-3">
                <FiBell className="text-xl" />
                <h2 className="text-lg font-bold">Notifications</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><FiX /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-6 flex items-start space-x-4 hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-primary-50/30' : ''}`}>
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <p 
                            className={`text-sm ${!n.isRead ? 'font-bold text-gray-900 cursor-pointer hover:underline' : 'font-medium text-gray-600 cursor-pointer hover:underline'}`}
                            onClick={async () => {
                              if (!n.isRead) {
                                try {
                                  await api.put(`/notifications/${n.id}/read`);
                                  setNotifications(notifications.map(item => item.id === n.id ? { ...item, isRead: true } : item));
                                  if (onNotificationsRead) onNotificationsRead(); // Update Header count
                                } catch (e) {
                                  console.error(e);
                                }
                              }
                              onClose();
                              if (n.type === 'booking') navigate(`/bookings`);
                              else if (n.type === 'message') navigate(`/vendor/chat`);
                              else if (n.type === 'hotel') navigate(`/hotels/${n.relatedId}`);
                            }}
                          >
                            {n.title}
                          </p>
                          <button onClick={() => deleteNotification(n.id)} className="text-gray-400 hover:text-rose-500"><FiTrash2 size={14} /></button>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(n.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-10">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FiBell className="text-gray-300 text-3xl" />
                  </div>
                  <h3 className="font-bold text-gray-900">All caught up!</h3>
                  <p className="text-sm text-gray-500 mt-2">No new notifications at the moment.</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-6 border-t border-gray-100">
                <button onClick={markAllRead} className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;
