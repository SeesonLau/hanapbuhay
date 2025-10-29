// src/components/chat/ChatRoomList.tsx

import React, { useEffect, useState } from 'react';
import { UserContact, ChatRoom } from '@/lib/models/chat';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ChatService } from '@/lib/services/chat/chat-services';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/services/supabase/client';

interface ChatRoomListProps {
    currentUserId: string;
    activeRoomId: string;
    contacts: UserContact[];
    onSelectRoom: (room: ChatRoom, contact: UserContact) => void;
    onNewMessage?: (message: any) => void; // Add this prop for real-time updates
}

const GLOBAL_ROOM_ID = ChatService.getGlobalRoomId();
const GLOBAL_ROOM_NAME = 'Global Realtime Chat';

export const ChatRoomList: React.FC<ChatRoomListProps> = ({ 
    currentUserId, 
    activeRoomId, 
    contacts, 
    onSelectRoom,
    onNewMessage 
}) => {
    const [localContacts, setLocalContacts] = useState<UserContact[]>(contacts);
    
    // Update local contacts when props change
    useEffect(() => {
        setLocalContacts(contacts);
    }, [contacts]);

    // Listen for new messages to update the contact list in real-time
    useEffect(() => {
        if (!currentUserId) return;

        console.log('🔔 Setting up ChatRoomList real-time subscription');

        const channel = supabase
            .channel('chat-room-list-updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    console.log('🆕 New message for ChatRoomList:', payload);
                    const newMessage = payload.new as any;
                    
                    // Only process messages not sent by current user
                    if (newMessage.sender_id !== currentUserId) {
                        updateContactWithNewMessage(newMessage);
                    }
                }
            )
            .subscribe();

        return () => {
            console.log('🧹 Cleaning up ChatRoomList subscription');
            supabase.removeChannel(channel);
        };
    }, [currentUserId]);

    // Update contact when a new message is received
    const updateContactWithNewMessage = (message: any) => {
        setLocalContacts(prev => 
            prev.map(contact => {
                if (contact.room_id === message.room_id) {
                    // Update the last message and increment unread count if not active
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
                        unreadCount: contact.room_id === activeRoomId 
                            ? 0  // Reset if this is the active room
                            : (contact.unreadCount + 1) // Increment if not active
                    };
                    return updatedContact;
                }
                return contact;
            })
        );
    };

    // Also update when parent component notifies about new messages
    useEffect(() => {
        if (onNewMessage) {
            const handleNewMessage = (message: any) => {
                updateContactWithNewMessage(message);
            };
            
            // This would be set by the parent component
            // For now, we'll use the Supabase subscription above
        }
    }, [onNewMessage, activeRoomId]);

    const handleRoomClick = (contact: UserContact) => {
        // Reset unread count when room is selected
        setLocalContacts(prev => 
            prev.map(c => 
                c.room_id === contact.room_id 
                    ? { ...c, unreadCount: 0 }
                    : c
            )
        );

        // 1. Global Room Switch
        if (contact.room_id === GLOBAL_ROOM_ID) {
            const globalRoom: ChatRoom = {
                id: GLOBAL_ROOM_ID,
                type: 'global',
                name: GLOBAL_ROOM_NAME,
                participants: null,
                created_at: new Date().toISOString(),
            };
            onSelectRoom(globalRoom, { ...contact, unreadCount: 0 });
            return;
        }

        // 2. Private Room Switch (Direct Message)
        if (contact.room_id) {
            const privateRoom: ChatRoom = {
                id: contact.room_id,
                type: 'private',
                name: contact.name,
                participants: [currentUserId, contact.userId],
                created_at: new Date().toISOString(),
            };
            onSelectRoom(privateRoom, { ...contact, unreadCount: 0 });
            return;
        }

        toast.error('Could not identify chat room or contact.');
    };

    // Sort contacts by last message time (most recent first)
    const sortedContacts = [...localContacts].sort((a, b) => {
        const aTime = a.lastMessage?.created_at || a.room_id === GLOBAL_ROOM_ID ? '9999-12-31' : '0000-01-01';
        const bTime = b.lastMessage?.created_at || b.room_id === GLOBAL_ROOM_ID ? '9999-12-31' : '0000-01-01';
        
        // Global chat always first, then by last message time
        if (a.room_id === GLOBAL_ROOM_ID) return -1;
        if (b.room_id === GLOBAL_ROOM_ID) return 1;
        
        return bTime.localeCompare(aTime);
    });

    return (
        <div className="flex-1 overflow-y-auto">
            {sortedContacts.map((contact) => (
                <div
                    key={contact.room_id || contact.userId}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                        contact.room_id === activeRoomId 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : 'border-l-4 border-transparent'
                    }`}
                    onClick={() => handleRoomClick(contact)}
                >
                    {/* Contact Avatar */}
                    <Avatar className="h-10 w-10">
                        <AvatarImage 
                            src={contact.profilePicUrl || undefined} 
                            alt={contact.name} 
                        />
                        <AvatarFallback className="bg-gray-300 text-gray-700">
                            {contact.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* Contact Info */}
                    <div className="ml-3 flex-1 overflow-hidden">
                        <p className="font-semibold text-gray-800 truncate">
                            {contact.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            {contact.lastMessage 
                                ? contact.lastMessage.content 
                                : (contact.room_id === GLOBAL_ROOM_ID 
                                    ? 'Global Chat' 
                                    : 'Tap to start chat')
                            }
                        </p>
                    </div>

                    {/* Unread Count Badge */}
                    {contact.unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {contact.unreadCount}
                        </span>
                    )}

                    {/* Last message time */}
                    {contact.lastMessage && (
                        <p className="text-xs text-gray-400 ml-2">
                            {new Date(contact.lastMessage.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};
