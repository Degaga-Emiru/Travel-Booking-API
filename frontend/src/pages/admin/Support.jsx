import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiSearch, FiMessageSquare, FiUsers, FiMail } from 'react-icons/fi';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Support = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    socket.current = io(socketUrl);
    socket.current.emit('join', user.id);

    socket.current.on('receiveMessage', (message) => {
      if (selectedContact?.id === message.senderId) {
        setMessages((prev) => [...prev, message]);
      }
      fetchConversations();
    });

    return () => {
      socket.current.disconnect();
    };
  }, [selectedContact]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get('/admin/users', { params: { limit: 100 } });
      setAllUsers((response.data.data || []).filter(u => u.id !== user.id));
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const response = await api.get(`/chat/${contactId}`);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const messageData = {
      senderId: user.id,
      receiverId: selectedContact.id,
      content: newMessage
    };

    socket.current.emit('sendMessage', messageData);
    
    const tempMessage = {
      id: Date.now(),
      senderId: user.id,
      content: newMessage,
      createdAt: new Date(),
      Sender: { firstName: user.firstName, lastName: user.lastName }
    };
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');
  };

  const getRoleBadge = (role) => {
    const colors = {
      customer: 'bg-blue-100 text-blue-600',
      vendor: 'bg-emerald-100 text-emerald-600',
      admin: 'bg-purple-100 text-purple-600'
    };
    return colors[role] || 'bg-gray-100 text-gray-600';
  };

  // Merge conversations with all users for the admin to be able to message anyone
  const getContactList = () => {
    const conversationIds = new Set(conversations.map(c => c.id));
    const merged = [...conversations];
    
    // If searching, show matching users not already in conversations
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const filtered = allUsers.filter(u => 
        !conversationIds.has(u.id) && 
        (`${u.firstName} ${u.lastName}`.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s))
      );
      merged.push(...filtered);
    }
    
    return merged;
  };

  const contactList = getContactList();

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Sidebar - Contacts */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <FiUsers className="mr-1" size={12} /> {conversations.length}
            </span>
          </div>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users to message..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contactList.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <FiMail size={40} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs mt-1">Search for a user to start chatting</p>
            </div>
          ) : (
            contactList.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 flex items-center space-x-3 cursor-pointer transition-all duration-200
                  ${selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-bold text-gray-900 truncate">{contact.firstName} {contact.lastName}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${getRoleBadge(contact.role)}`}>
                      {contact.role}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate">{contact.email}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/30">
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-lg">
                  {selectedContact.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedContact.firstName} {selectedContact.lastName}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${getRoleBadge(selectedContact.role)}`}>
                      {selectedContact.role}
                    </span>
                    <span className="text-xs text-gray-400">{selectedContact.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <FiMessageSquare size={48} className="opacity-20 mb-4" />
                  <p className="font-medium">No messages yet</p>
                  <p className="text-xs">Start the conversation by sending a message below</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.senderId === user.id;
                  return (
                    <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm
                        ${isMine 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1.5 opacity-60 ${isMine ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef}></div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100 px-8">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Type your message here..." 
                  className="w-full pl-6 pr-16 py-4 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-gray-100"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-2 p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:shadow-none"
                >
                  <FiSend />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FiMessageSquare size={40} className="opacity-20" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Support Center</h2>
            <p className="text-center max-w-xs text-sm">Select a conversation from the left sidebar, or search for any user to start a new support chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
