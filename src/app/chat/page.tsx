// src/app/chat/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import Banner from '@/components/ui/Banner';
import { AuthService } from '@/lib/services/auth-services';
import ChatList from '@/components/chat/ChatList';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import ChatHeader from '@/components/chat/ChatHeader';
import { ChatService, ChatRoom, Message } from '@/lib/services/chat-services';
import { startChatWithUser } from '@/lib/utils/chat-utils';

export default function ChatPage() {
  const user = useUser();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id || '';

  // Fetch user's chat rooms
  useEffect(() => {
    if (currentUserId) {
      loadChatRooms();
    }
  }, [currentUserId]);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat && currentUserId) {
      loadMessages(activeChat);
      ChatService.markAsRead(activeChat, currentUserId);
      
      // Subscribe to new messages
      const subscription = ChatService.subscribeToMessages(activeChat, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
        
        // Mark as read if it's not from current user
        if (newMessage.sender_id !== currentUserId) {
          ChatService.markAsRead(activeChat, currentUserId);
          loadChatRooms(); // Refresh chat list to update unread counts
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [activeChat, currentUserId]);

  // Subscribe to chat room updates
  useEffect(() => {
    if (currentUserId) {
      const subscription = ChatService.subscribeToChatRooms(currentUserId, () => {
        loadChatRooms();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatRooms = async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    try {
      const rooms = await ChatService.getUserChatRooms(currentUserId);
      setChatRooms(rooms);
      
      // Auto-select first chat if none selected
      if (!activeChat && rooms.length > 0) {
        setActiveChat(rooms[0].id);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatRoomId: string) => {
    setMessages([]);
    try {
      const chatMessages = await ChatService.getMessages(chatRoomId);
      setMessages(chatMessages);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!activeChat || !currentUserId) return;

    setSending(true);
    try {
      const newMessage = await ChatService.sendMessage(activeChat, currentUserId, messageText);
      if (newMessage) {
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
        loadChatRooms(); // Refresh chat list to update last message
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleChatSelect = (chatRoomId: string) => {
    setActiveChat(chatRoomId);
    ChatService.markAsRead(chatRoomId, currentUserId);
    loadChatRooms(); // Refresh to update unread counts
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      setSearching(true);
      try {
        const results = await ChatService.searchUsers(query, currentUserId);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleStartNewChat = async (otherUserId: string, userName: string) => {
    if (!currentUserId) return;

    try {
      const chatRoomId = await startChatWithUser(currentUserId, otherUserId);
      if (chatRoomId) {
        setActiveChat(chatRoomId);
        setShowSearchResults(false);
        setSearchQuery('');
        await loadChatRooms(); // Refresh the chat list
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  const activeChatRoom = chatRooms.find(room => room.id === activeChat);

  return (
    <div className="min-h-screen">
      {/* Banner Section with Header */}
      <Banner
        variant="chat"
        showSearchBar={false}
        userName={user?.name ?? user?.email ?? user?.id}
      />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-[600px]">
            {/* Chat List Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                  <button
                    onClick={() => {
                      setShowSearchResults(!showSearchResults);
                      setSearchQuery('');
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                  >
                    New Chat
                  </button>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search users by name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Search Results */}
              {showSearchResults && (
                <div className="border-b border-gray-200 max-h-48 overflow-y-auto">
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">
                      {searching ? 'Searching...' : 'Search Results'}
                    </h3>
                    {searching ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        {searchQuery.trim().length > 2 ? 'No users found' : 'Type at least 3 characters to search'}
                      </p>
                    ) : (
                      searchResults.map((user) => (
                        <div
                          key={user.userId}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleStartNewChat(user.userId, user.name)}
                        >
                          <img
                            src={user.profilePictureUrl || '/default-avatar.png'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-800">{user.name}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Chat List */}
              <div className="flex-1 overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading conversations...</p>
                    </div>
                  </div>
                ) : (
                  <ChatList
                    chatRooms={chatRooms}
                    activeChat={activeChat}
                    onChatSelect={handleChatSelect}
                    currentUserId={currentUserId}
                  />
                )}
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 flex flex-col">
              {activeChat && activeChatRoom ? (
                <>
                  <ChatHeader 
                    chatRoom={activeChatRoom} 
                    currentUserId={currentUserId} 
                  />
                  
                  <div className="flex-1 overflow-hidden">
                    <MessageList 
                      messages={messages} 
                      currentUserId={currentUserId} 
                    />
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <MessageInput 
                    onSendMessage={handleSendMessage}
                    disabled={sending}
                  />
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-8">
                  <div className="text-center text-gray-500 max-w-md">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Welcome to Messages</h3>
                    <p className="mb-4">
                      {chatRooms.length === 0 
                        ? "Start a conversation by searching for users above."
                        : "Select a conversation from the sidebar to start messaging."
                      }
                    </p>
                    {chatRooms.length === 0 && (
                      <button
                        onClick={() => setShowSearchResults(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Start Your First Conversation
                      </button>
                    )}
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
