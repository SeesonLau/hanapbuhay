// src/app/chat/page.tsx
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RealtimeChat } from '@/components/chat/RealtimeChat';
import { ChatRoomList } from '@/components/chat/ChatRoomList';
import { SearchUsers } from '@/components/chat/SearchUsers';
import Banner from '@/components/ui/Banner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Preloader, PreloaderMessages } from '@/components/ui/Preloader';
import { UserContact, ChatRoom } from '@/lib/models/chat';
import { AuthService } from "@/lib/services/auth-services";
import { ProfileService } from "@/lib/services/profile-services";
import { ChatService } from "@/lib/services/chat/chat-services";
import { toast } from 'react-hot-toast';

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
// ------------------------------------------

const GLOBAL_ROOM_ID = ChatService.getGlobalRoomId(); 
const GLOBAL_ROOM_NAME = 'Global Realtime Chat';

export default function ChatPage() {
    const { profile, isLoading } = useCurrentProfile();
    const [userContactsMap, setUserContactsMap] = useState<Record<string, UserContact>>({});
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    // Fix hydration by waiting for component to mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Convert map to a sorted array for the sidebar list - memoized to prevent re-renders
    const userContacts = useMemo(() => {
        const list = Object.values(userContactsMap);
        list.sort((a, b) => {
            if (a.room_id === GLOBAL_ROOM_ID) return -1;
            if (b.room_id === GLOBAL_ROOM_ID) return 1;
            return (b.lastMessage?.created_at || '') < (a.lastMessage?.created_at || '') ? -1 : 1;
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
                console.log('✅ Rooms loaded:', {
                    global: true,
                    dmCount: existingRooms.length,
                    totalRooms: Object.keys(initialMap).length
                });
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

    // Stable handler to switch the active chat room
    const handleSelectRoom = useCallback((room: ChatRoom, contact: UserContact) => {
        console.log('💬 Switching to room:', room.id, room.name);
        setActiveRoom(prevRoom => {
            // Only update if the room is actually changing
            if (prevRoom?.id === room.id) return prevRoom;
            return room;
        });
        
        // Update unread count for the selected contact to zero locally
        setUserContactsMap(prev => ({
            ...prev,
            [room.id]: { ...contact, unreadCount: 0 },
        }));
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
            setActiveRoom(prevRoom => {
                if (prevRoom?.id === newRoom.id) return prevRoom;
                return newRoom;
            });
            console.log('✅ DM room created/selected:', newRoom.id);
        } else {
            toast.error(`Could not start chat with ${contact.name}.`);
            console.error('❌ Failed to create DM room');
        }
    }, [profile]);

    // Memoize active contact to prevent unnecessary re-renders
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
                <Preloader isVisible={true} message="Loading chat..." variant="default" />
            </div>
        );
    }
    
    if (isLoading) {
        return <Preloader isVisible={isLoading} message={PreloaderMessages.LOADING_CHAT} variant="default" />;
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

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-[240px]">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="flex h-[600px]">

                        {/* 1. Chat List Sidebar (Rooms and Search) */}
                        <div className="w-1/3 border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
                                <SearchUsers currentUserId={profile.id} onUserSelect={handleUserSelectForDM} />
                            </div>

                            <ChatRoomList
                                currentUserId={profile.id}
                                activeRoomId={activeRoom?.id || ''}
                                contacts={userContacts}
                                onSelectRoom={handleSelectRoom}
                            />
                        </div>

                        {/* 2. Chat Messages Area */}
                        <div className="flex-1 flex flex-col">
                            
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={activeContact.profilePicUrl || undefined} alt={activeContact.name} />
                                        <AvatarFallback className="bg-gray-300 text-gray-700">
                                            {activeContact.name ? activeContact.name.substring(0, 2).toUpperCase() : '??'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-lg font-semibold text-gray-800">{activeContact.name}</h3>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col overflow-hidden">
                                {activeRoom && (
                                    <RealtimeChat
                                        key={activeRoom.id}
                                        roomId={activeRoom.id}
                                        roomName={activeRoom.name || 'Chat Room'}
                                        username={profile.name}
                                        userId={profile.id}
                                        isGlobal={activeRoom.type === 'global'}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
