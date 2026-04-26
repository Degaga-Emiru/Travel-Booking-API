import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiUser, FiSearch, FiMessageSquare } from 'react-icons/fi';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Support = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.current.emit('join', user.id);

    socket.current.on('receiveMessage', (message) => {
      if (selectedContact?.id === message.senderId) {
        setMessages((prev) => [...prev, message]);
      }
      // Refresh conversations list to show latest message/contact
      fetchConversations();
    });

    return () => {
      socket.current.disconnect();
    };
  }, [selectedContact]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      setConversations(response.data.data);
    } catch (error) {
      console.error('Failed to fetch conversations', error);
    }
  };

  const fetchMessages = async (contactId) => {
    try {
      const response = await api.get(`/chat/${contactId}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  useEffect(() => {
    fetchConversations();
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
    
    // Optimistic UI update
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

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Sidebar - Contacts */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <div className="relative mt-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <FiMessageSquare size={40} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">No active chats</p>
            </div>
          ) : (
            conversations.map((contact) => (
              <div 
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 flex items-center space-x-3 cursor-pointer transition-colors
                  ${selectedContact?.id === contact.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                  {contact.firstName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-bold text-gray-900 truncate">{contact.firstName} {contact.lastName}</p>
                    <span className="text-[10px] text-gray-400">12:45 PM</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate capitalize">{contact.role}</p>
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
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between px-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
                  {selectedContact.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedContact.firstName} {selectedContact.lastName}</h3>
                  <p className="text-xs text-emerald-500 font-medium flex items-center">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></div>
                    Online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
              {messages.map((msg, index) => {
                const isMine = msg.senderId === user.id;
                return (
                  <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm
                      ${isMine 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 opacity-60 ${isMine ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
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
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FiMessageSquare size={40} className="opacity-20" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h2>
            <p className="text-center max-w-xs">Pick a contact from the left sidebar to start chatting in real-time with customers or vendors.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
