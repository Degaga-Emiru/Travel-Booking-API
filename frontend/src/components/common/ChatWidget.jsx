import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend, FiPaperclip, FiMoreHorizontal } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [supportAdmin, setSupportAdmin] = useState(null);
  const { user } = useAuth();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchSupportAdmin = async () => {
      try {
        const res = await api.get('/chat/conversations');
        const admins = res.data.data.filter(u => u.role === 'admin');
        if (admins.length > 0) setSupportAdmin(admins[0]);
      } catch (err) {
        console.error('Support admin fetch error', err);
      }
    };
    if (user) fetchSupportAdmin();
  }, [user]);

  useEffect(() => {
    if (user) {
      socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      
      socketRef.current.emit('join', user.id);

      socketRef.current.on('receiveMessage', (message) => {
        setMessages((prev) => {
          if (prev.find(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user.id,
      receiverId: supportAdmin?.id || 'admin',
      content: newMessage,
      timestamp: new Date()
    };

    socketRef.current.emit('sendMessage', messageData);
    setNewMessage('');
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="mb-4 w-96 h-[500px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center font-bold">A</div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div>
                  <p className="font-bold text-sm">Support Team</p>
                  <p className="text-[10px] opacity-60 uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><FiMoreHorizontal /></button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><FiX /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              <div className="text-center py-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">Today</span>
              </div>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                    msg.senderId === user.id 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors"><FiPaperclip /></button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-sm font-medium"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="p-3 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-900/20 hover:bg-primary-700 transition-all active:scale-95"
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl shadow-slate-900/40 hover:scale-110 active:scale-90 transition-all group relative"
      >
        <FiMessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          1
        </span>
      </button>
    </div>
  );
};

export default ChatWidget;
