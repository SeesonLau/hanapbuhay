// src/app/chat/page.tsx
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RealtimeChat } from '@/components/chat/RealtimeChat';
import { ChatRoomList } from '@/components/chat/ChatRoomList';
import { SearchUsers } from '@/components/chat/SearchUsers';
import Banner from '@/components/ui/Banner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { UserContact, ChatRoom, ChatMessage } from '@/lib/models/chat';
import { AuthService } from "@/lib/services/auth-services";
import { ProfileService } from "@/lib/services/profile-services";
import { ChatService } from "@/lib/services/chat/chat-services";
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/services/supabase/client';
import { FiArrowLeft, FiMenu } from 'react-icons/fi';

// --- Custom Hook to Fetch Profile Data ---
interface UserProfile {
  id: string;
  name: string;
  profilePicUrl: string | null;
}

const useCurrentProfile = () => { 
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const currentUser = await AuthService.getCurrentUser();
        
        if (currentUser) {
          const profileData = await ProfileService.getNameProfilePic(currentUser.id);
          
          setProfile({
            id: currentUser.id,
            name: profileData?.name || 'User',
            profilePicUrl: profileData?.profilePicUrl || null,
          });
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching user profile for chat:', error);
        setProfile({ id: 'unknown-id', name: 'Guest User', profilePicUrl: null });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return { profile, isLoading };
};

const GLOBAL_ROOM_ID = ChatService.getGlobalRoomId(); 
const GLOBAL_ROOM_NAME = 'Global Realtime Chat';

export default function ChatPage() {
  const { profile, isLoading } = useCurrentProfile();
  const [userContactsMap, setUserContactsMap] = useState<Record<string, UserContact>>({});
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showMobileChatView, setShowMobileChatView] = useState(false);

  // Fix hydration by waiting for component to mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Centralized real-time subscription for ALL messages
  useEffect(() => {
    if (!profile?.id) return;

    console.log('🔔 Setting up global real-time subscription for user:', profile.id);

    const channel = supabase
      .channel('global-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const newMessage = payload.new as any;
          console.log('🆕 Global new message received:', newMessage);

          // Update the contact list with new message
          setUserContactsMap(prev => {
            const contact = prev[newMessage.room_id];
            if (!contact) {
              console.log('Contact not found for room:', newMessage.room_id);
              return prev;
            }

            const isFromCurrentUser = newMessage.sender_id === profile.id;
            const isActiveRoom = newMessage.room_id === activeRoom?.id;
            
            const updatedContact: UserContact = {
              ...contact,
              lastMessage: {
                id: newMessage.id,
                room_id: newMessage.room_id,
                sender_id: newMessage.sender_id,
                content: newMessage.content,
                created_at: newMessage.created_at,
                is_read_by: newMessage.is_read_by || [],
              },
              unreadCount: isFromCurrentUser || isActiveRoom 
                ? 0 
                : (contact.unreadCount + 1)
            };

            return {
              ...prev,
              [newMessage.room_id]: updatedContact,
            };
          });

          // If this message is in the active room and not from current user, mark as read
          if (newMessage.room_id === activeRoom?.id && newMessage.sender_id !== profile.id) {
            ChatService.markMessagesAsRead([newMessage.id], profile.id);
          }
        }
      )
      .subscribe((status) => {
        console.log('Global subscription status:', status);
      });

    return () => {
      console.log('🧹 Cleaning up global subscription');
      supabase.removeChannel(channel);
    };
  }, [profile?.id, activeRoom?.id]);

  // Convert map to a sorted array for the sidebar list
  const userContacts = useMemo(() => {
    const list = Object.values(userContactsMap);
    list.sort((a, b) => {
      if (a.room_id === GLOBAL_ROOM_ID) return -1;
      if (b.room_id === GLOBAL_ROOM_ID) return 1;
      
      const aTime = a.lastMessage?.created_at || '0000-01-01';
      const bTime = b.lastMessage?.created_at || '0000-01-01';
      return bTime.localeCompare(aTime);
    });
    return list;
  }, [userContactsMap]);

  // Load rooms only once when profile is available
  useEffect(() => {
    if (!profile || !isInitialLoad) return;

    const loadRooms = async () => {
      try {
        console.log('🔄 Loading chat rooms for user:', profile.id);
        const existingRooms = await ChatService.getExistingChatRooms(profile.id);

        const initialMap: Record<string, UserContact> = {};

        // Add the Global Chat first
        initialMap[GLOBAL_ROOM_ID] = {
          userId: 'global',
          name: GLOBAL_ROOM_NAME,
          profilePicUrl: null,
          unreadCount: 0, 
          room_id: GLOBAL_ROOM_ID,
        };

        // Add existing DMs
        existingRooms.forEach((contact: UserContact) => {
          if (contact.room_id) {
            initialMap[contact.room_id] = contact;
          }
        });

        setUserContactsMap(initialMap);
        
        // Set active room to Global Chat initially
        setActiveRoom({
          id: GLOBAL_ROOM_ID,
          type: 'global',
          name: GLOBAL_ROOM_NAME,
          participants: null,
          created_at: new Date().toISOString(),
        });

        setIsInitialLoad(false);
        console.log('✅ Rooms loaded:', Object.keys(initialMap).length);
      } catch (error) {
        console.error('❌ Error loading rooms:', error);
        // Fallback with just global room
        setUserContactsMap({
          [GLOBAL_ROOM_ID]: {
            userId: 'global',
            name: GLOBAL_ROOM_NAME,
            profilePicUrl: null,
            unreadCount: 0, 
            room_id: GLOBAL_ROOM_ID,
          }
        });
        setActiveRoom({
          id: GLOBAL_ROOM_ID,
          type: 'global',
          name: GLOBAL_ROOM_NAME,
          participants: null,
          created_at: new Date().toISOString(),
        });
        setIsInitialLoad(false);
      }
    };
    
    loadRooms();
  }, [profile, isInitialLoad]);

  // Handler for new messages from RealtimeChat
  const handleNewMessage = useCallback((message: ChatMessage) => {
    console.log('📨 New message callback from RealtimeChat:', message);
    
    // Update the contact list when a new message is sent
    setUserContactsMap(prev => {
      const contact = prev[message.room_id];
      if (!contact) return prev;

      const updatedContact: UserContact = {
        ...contact,
        lastMessage: {
          id: message.id,
          room_id: message.room_id,
          sender_id: message.sender_id,
          content: message.content,
          created_at: message.created_at,
          is_read_by: message.is_read_by || [],
        },
        unreadCount: 0 // Reset since we're sending or it's the active room
      };

      return {
        ...prev,
        [message.room_id]: updatedContact,
      };
    });
  }, []);

  // Stable handler to switch the active chat room
  const handleSelectRoom = useCallback((room: ChatRoom, contact: UserContact) => {
    console.log('💬 Switching to room:', room.id, room.name);
    
    // Reset unread count when switching to this room
    setUserContactsMap(prev => ({
      ...prev,
      [room.id]: { ...contact, unreadCount: 0 },
    }));

    setActiveRoom(prevRoom => {
      if (prevRoom?.id === room.id) return prevRoom;
      return room;
    });

    // On mobile, show chat view
    setShowMobileChatView(true);
  }, []);

  // Stable handler for starting DMs
  const handleUserSelectForDM = useCallback(async (contact: UserContact) => {
    if (!profile) return;

    console.log('🤝 Starting DM with user:', contact.userId, contact.name);

    // 1. Get or Create the Private Room
    const result = await ChatService.getOrCreatePrivateRoom(profile.id, contact.userId);
    
    if (result) {
      const newRoom = result.room;
      
      // 2. Update the map state
      const contactWithRoom: UserContact = { 
        ...contact, 
        room_id: newRoom.id, 
        unreadCount: 0,
      };
      
      setUserContactsMap(prev => ({
        ...prev,
        [newRoom.id]: contactWithRoom,
      }));

      // 3. Set the new room as active
      setActiveRoom(newRoom);
      
      // On mobile, show chat view
      setShowMobileChatView(true);
      
      console.log('✅ DM room created/selected:', newRoom.id);
    } else {
      toast.error(`Could not start chat with ${contact.name}.`);
      console.error('❌ Failed to create DM room');
    }
  }, [profile]);

  // Handle back button on mobile
  const handleBackToList = () => {
    setShowMobileChatView(false);
  };

  // Memoize active contact
  const activeContact = useMemo(() => {
    return userContactsMap[activeRoom?.id || ''] || { 
      name: activeRoom?.name || 'Chat', 
      profilePicUrl: null 
    };
  }, [userContactsMap, activeRoom]);

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Preloader isVisible={true} message="Loading chat..." />
      </div>
    );
  }
  
  if (isLoading) {
    return <Preloader isVisible={isLoading} message={PreloaderMessages.LOADING_CHAT} />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen p-10 bg-gray-50 text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Required</h1>
        <p className="mt-2 text-gray-600">Please log in to access the chat feature.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <Banner variant="chat" showSearchBar={false} />

      {/* Main content area - responsive padding */}
      <div className="pt-[140px] mobile-L:pt-[160px] tablet:pt-[180px] min-h-screen">
        <div className="h-[calc(100vh-140px)] mobile-L:h-[calc(100vh-160px)] tablet:h-[calc(100vh-180px)]">
          <div className="bg-white rounded-none tablet:rounded-lg shadow-none tablet:shadow-lg tablet:mx-4 h-full overflow-hidden">
            <div className="flex h-full relative">

              {/* 1. Chat List Sidebar - Shows on mobile when chat is NOT open */}
              <div 
                className={`
                  ${showMobileChatView ? 'hidden' : 'flex'}
                  tablet:flex
                  w-full tablet:w-1/3 laptop:w-1/4
                  bg-white
                  border-b tablet:border-b-0 tablet:border-r border-gray-200 
                  flex-col
                `}
              >
                <div className="p-3 mobile-L:p-4 border-b border-gray-200 bg-white flex-shrink-0">
                  <h2 className="text-lg mobile-L:text-xl font-semibold text-gray-800 mb-3">Messages</h2>
                  <SearchUsers currentUserId={profile.id} onUserSelect={handleUserSelectForDM} />
                </div>

                <div className="flex-1 overflow-y-auto">
                  <ChatRoomList
                    currentUserId={profile.id}
                    activeRoomId={activeRoom?.id || ''}
                    contacts={userContacts}
                    onSelectRoom={handleSelectRoom}
                  />
                </div>
              </div>

              {/* 2. Chat Messages Area - Shows on mobile when chat IS open */}
              <div className={`
                ${showMobileChatView ? 'flex' : 'hidden'}
                tablet:flex
                flex-1 flex-col
                w-full
              `}>
                
                {/* Chat Header */}
                <div className="p-3 mobile-L:p-4 border-b border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-center space-x-2 mobile-L:space-x-3">
                    {/* Back button for mobile */}
                    <button
                      onClick={handleBackToList}
                      className="tablet:hidden p-2 hover:bg-gray-100 rounded-lg -ml-2 transition-colors"
                      aria-label="Back to conversations"
                    >
                      <FiArrowLeft size={20} className="text-gray-700" />
                    </button>

                    <Avatar className="h-8 w-8 mobile-L:h-10 mobile-L:w-10 flex-shrink-0">
                      <AvatarImage src={activeContact.profilePicUrl || undefined} alt={activeContact.name} />
                      <AvatarFallback className="bg-gray-300 text-gray-700 text-xs mobile-L:text-sm">
                        {activeContact.name ? activeContact.name.substring(0, 2).toUpperCase() : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base mobile-L:text-lg font-semibold text-gray-800 truncate">
                        {activeContact.name}
                      </h3>
                      {activeRoom && (
                        <p className="text-xs mobile-L:text-sm text-gray-500 truncate">
                          {activeRoom.type === 'global' ? 'Global chat room' : 'Direct message'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  {activeRoom ? (
                    <RealtimeChat
                      key={activeRoom.id}
                      roomId={activeRoom.id}
                      roomName={activeRoom.name || 'Chat Room'}
                      username={profile.name}
                      userId={profile.id}
                      isGlobal={activeRoom.type === 'global'}
                      onNewMessage={handleNewMessage}
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
                      <div className="text-center max-w-sm">
                        <div className="w-12 h-12 mobile-L:w-16 mobile-L:h-16 mx-auto mb-3 mobile-L:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 mobile-L:w-8 mobile-L:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-sm mobile-L:text-base">Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}