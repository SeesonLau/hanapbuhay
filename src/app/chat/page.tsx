// src/app/chat/page.tsx
'use client';
import { useState } from 'react';
import Banner from '@/components/ui/Banner';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  read: boolean;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  online: boolean;
}

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Hey! I saw your job post and I\'m very interested.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 2,
      online: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      lastMessage: 'Thanks for considering my application!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 0,
      online: false
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      lastMessage: 'When can we schedule the interview?',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      unreadCount: 1,
      online: true
    },
    {
      id: 4,
      name: 'David Kim',
      lastMessage: 'I\'ve completed the task you assigned.',
      timestamp: new Date(Date.now() - 1000 * 3600 * 24),
      unreadCount: 0,
      online: false
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I saw your job post for the Web Developer position.',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      read: true
    },
    {
      id: 2,
      text: 'Hi Sarah! Thanks for reaching out. What caught your attention about the position?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      read: true
    },
    {
      id: 3,
      text: 'I really liked your company\'s approach to modern web technologies. I have 5 years of experience with React and Node.js.',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: true
    },
    {
      id: 4,
      text: 'That\'s great to hear! Would you like to schedule a quick call to discuss further?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
      read: true
    },
    {
      id: 5,
      text: 'Absolutely! How about tomorrow at 2 PM?',
      sender: 'other',
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
      read: false
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: 'user',
        timestamp: new Date(),
        read: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header */}
      <Banner
        variant="chat"
        showSearchBar={false}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-[600px]">
            {/* Chat List Sidebar */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="overflow-y-auto h-full">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      activeChat === chat.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setActiveChat(chat.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {chat.name.charAt(0)}
                          </div>
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {chat.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.timestamp)}
                        </span>
                        {chat.unreadCount > 0 && (
                          <div className="mt-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center ml-auto">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 flex flex-col">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        S
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Sarah Johnson</h3>
                        <p className="text-sm text-gray-600">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <span
                            className={`text-xs mt-1 block ${
                              msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      💬
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                    <p>Choose a chat from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
