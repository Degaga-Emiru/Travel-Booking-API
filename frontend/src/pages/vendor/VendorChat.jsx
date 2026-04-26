import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiMessageSquare, FiSearch, FiMoreVertical, FiPaperclip } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const VendorChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([
    { id: '1', name: 'Admin Support', lastMsg: 'Your verification is complete.', unread: 0, avatar: 'A' },
    { id: '2', name: 'John Doe (Customer)', lastMsg: 'Is the suite available?', unread: 2, avatar: 'J' },
  ]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socketRef.current.emit('join', user.id);
    
    socketRef.current.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const msgData = {
      senderId: user.id,
      receiverId: selectedChat.id,
      content: newMessage,
      timestamp: new Date()
    };
    socketRef.current.emit('send_message', msgData);
    setMessages(prev => [...prev, { ...msgData, isMine: true }]);
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-180px)] bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-50 flex flex-col">
        <div className="p-8 border-b border-gray-50">
           <h3 className="text-xl font-black text-slate-900 mb-6">Messages</h3>
           <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto">
           {conversations.map(chat => (
              <button 
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-6 flex items-center space-x-4 hover:bg-gray-50 transition-all border-l-4 ${selectedChat?.id === chat.id ? 'border-primary-600 bg-primary-50/20' : 'border-transparent'}`}
              >
                 <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">{chat.avatar}</div>
                 <div className="flex-1 text-left">
                    <div className="flex justify-between items-center mb-1">
                       <p className="text-sm font-black text-slate-900">{chat.name}</p>
                       {chat.unread > 0 && <span className="w-5 h-5 bg-primary-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">{chat.unread}</span>}
                    </div>
                    <p className="text-xs text-gray-400 font-medium truncate">{chat.lastMsg}</p>
                 </div>
              </button>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-gray-50/30">
          <div className="p-6 bg-white border-b border-gray-50 flex justify-between items-center px-10">
             <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">{selectedChat.avatar}</div>
                <div>
                   <p className="text-sm font-black text-slate-900">{selectedChat.name}</p>
                   <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Online</p>
                </div>
             </div>
             <button className="p-2 text-gray-400 hover:text-slate-900"><FiMoreVertical /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-6">
             {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] p-5 rounded-[1.5rem] shadow-sm text-sm font-medium ${msg.senderId === user.id ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none border border-gray-50'}`}>
                      {msg.content}
                   </div>
                </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-8 bg-white border-t border-gray-50 px-10">
             <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <button className="p-3 text-gray-400 hover:text-primary-600"><FiPaperclip /></button>
                <input 
                   type="text" 
                   placeholder="Type your message..." 
                   className="flex-1 bg-transparent border-none outline-none text-sm font-bold"
                   value={newMessage}
                   onChange={e => setNewMessage(e.target.value)}
                   onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20 hover:scale-105 transition-all"
                >
                   <FiSend />
                </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiMessageSquare className="text-gray-200 text-4xl" />
           </div>
           <h3 className="text-2xl font-black text-slate-900">Select a conversation</h3>
           <p className="text-gray-500 mt-2">Pick a chat from the sidebar to start communicating with customers or admins.</p>
        </div>
      )}
    </div>
  );
};

export default VendorChat;
