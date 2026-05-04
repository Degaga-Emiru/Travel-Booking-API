import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiMessageSquare, FiSearch, FiMoreVertical, FiPaperclip, FiHeadphones } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const VendorChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      const contacts = response.data.data.map(c => ({
        ...c,
        avatar: (c.firstName?.charAt(0) || '') + (c.lastName?.charAt(0) || ''),
        name: `${c.firstName} ${c.lastName}`
      }));
      setConversations(contacts);
      
      // If we don't have a selected chat, try to find an admin to show by default
      if (!selectedChat) {
        const admin = contacts.find(c => c.role === 'admin');
        if (admin) setSelectedChat(admin);
      }
    } catch (error) {
      console.error('Failed to load conversations', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socketRef.current.emit('join', user.id);
    
    socketRef.current.on('receiveMessage', (msg) => {
      // Check if message is for the current conversation
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      fetchConversations(); // Update sidebar last message
    });

    return () => socketRef.current.disconnect();
  }, [user.id]);

  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(`/chat/${selectedChat.id}`);
          setMessages(response.data.data);
        } catch (error) {
          console.error('Failed to load messages', error);
        }
      };
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    
    const msgData = {
      senderId: user.id,
      receiverId: selectedChat.id,
      content: newMessage,
    };
    
    socketRef.current.emit('sendMessage', msgData);
    setNewMessage('');
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="h-[calc(100vh-180px)] bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-50 flex flex-col">
        <div className="p-8 border-b border-gray-50">
           <h3 className="text-xl font-black text-slate-900 mb-6">Support & Messages</h3>
           <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto">
           {conversations.length === 0 ? (
             <div className="p-10 text-center text-gray-400">
               <FiMessageSquare size={32} className="mx-auto mb-4 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-widest">No chats available</p>
             </div>
           ) : (
             conversations.map(chat => (
                <button 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-6 flex items-center space-x-4 hover:bg-gray-50 transition-all border-l-4 ${selectedChat?.id === chat.id ? 'border-primary-600 bg-primary-50/20' : 'border-transparent'}`}
                >
                   <div className={`w-12 h-12 ${chat.role === 'admin' ? 'bg-blue-600' : 'bg-slate-900'} text-white rounded-xl flex items-center justify-center font-bold shadow-lg`}>
                     {chat.role === 'admin' ? <FiHeadphones /> : chat.avatar}
                   </div>
                   <div className="flex-1 text-left">
                      <div className="flex justify-between items-center mb-1">
                         <p className="text-sm font-black text-slate-900 truncate">
                           {chat.name} {chat.role === 'admin' && <span className="ml-1 text-[8px] bg-blue-100 text-blue-600 px-1 py-0.5 rounded uppercase">Support</span>}
                         </p>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold truncate tracking-tight">{chat.role === 'admin' ? 'System Support' : chat.email}</p>
                   </div>
                </button>
             ))
           )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-gray-50/30">
          <div className="p-6 bg-white border-b border-gray-50 flex justify-between items-center px-10 shadow-sm relative z-10">
             <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${selectedChat.role === 'admin' ? 'bg-blue-600' : 'bg-slate-900'} text-white rounded-xl flex items-center justify-center font-bold`}>
                  {selectedChat.role === 'admin' ? <FiHeadphones /> : selectedChat.avatar}
                </div>
                <div>
                   <p className="text-sm font-black text-slate-900">{selectedChat.name}</p>
                   <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Chat</p>
                </div>
             </div>
             <button className="p-2 text-gray-400 hover:text-slate-900"><FiMoreVertical /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-6">
             {messages.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-300">
                 <FiMessageSquare size={48} className="mb-4 opacity-10" />
                 <p className="font-bold uppercase tracking-widest text-xs">Start a conversation</p>
               </div>
             ) : (
               messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[70%] p-5 rounded-[1.5rem] shadow-sm text-sm font-medium ${msg.senderId === user.id ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none border border-gray-50'}`}>
                        {msg.content}
                        <p className={`text-[8px] mt-2 opacity-40 ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </div>
                  </div>
               ))
             )}
             <div ref={messagesEndRef} />
          </div>

          <div className="p-8 bg-white border-t border-gray-50 px-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
             <form onSubmit={handleSend} className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <button type="button" className="p-3 text-gray-400 hover:text-primary-600"><FiPaperclip /></button>
                <input 
                   type="text" 
                   placeholder="Type your message..." 
                   className="flex-1 bg-transparent border-none outline-none text-sm font-bold p-2"
                   value={newMessage}
                   onChange={e => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                   <FiSend />
                </button>
             </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-gray-50/10">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiMessageSquare className="text-gray-200 text-4xl" />
           </div>
           <h3 className="text-2xl font-black text-slate-900">Support Center</h3>
           <p className="text-gray-500 mt-2 max-w-sm">Select the system administrator or a customer from the sidebar to begin chatting.</p>
        </div>
      )}
    </div>
  );
};

export default VendorChat;
