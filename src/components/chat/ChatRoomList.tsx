// ChatRoomList.tsx 
import React from 'react';
import { UserContact, ChatRoom } from '@/lib/models/chat';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ChatService } from '@/lib/services/chat/chat-services';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';

interface ChatRoomListProps {
    currentUserId: string;
    activeRoomId: string;
    contacts: UserContact[];
    onSelectRoom: (room: ChatRoom, contact: UserContact) => void;
}

const GLOBAL_ROOM_ID = ChatService.getGlobalRoomId();
const GLOBAL_ROOM_NAME = 'Global Chat';

export const ChatRoomList: React.FC<ChatRoomListProps> = ({ 
    currentUserId, 
    activeRoomId, 
    contacts, 
    onSelectRoom,
}) => {
    const { theme } = useTheme();
    
    const handleRoomClick = (contact: UserContact) => {
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

    const isMessageUnread = (contact: UserContact): boolean => {
        if (!contact.lastMessage) return false;
        if (contact.lastMessage.sender_id === currentUserId) return false;
        return !contact.lastMessage.is_read_by?.includes(currentUserId);
    };

    const formatLastMessage = (contact: UserContact): string => {
        if (!contact.lastMessage) {
            return contact.room_id === GLOBAL_ROOM_ID 
                ? 'Welcome to global chat' 
                : 'Say hello!';
        }

        const isFromCurrentUser = contact.lastMessage.sender_id === currentUserId;
        const content = contact.lastMessage.content;
        const maxLength = 40;
        
        if (isFromCurrentUser) {
            return `You: ${content.length > maxLength ? content.substring(0, maxLength) + '...' : content}`;
        } else {
            return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
        }
    };

    const sortedContacts = [...contacts].sort((a, b) => {
        const aTime = a.lastMessage?.created_at || a.room_id === GLOBAL_ROOM_ID ? '9999-12-31' : '0000-01-01';
        const bTime = b.lastMessage?.created_at || b.room_id === GLOBAL_ROOM_ID ? '9999-12-31' : '0000-01-01';
        
        if (a.room_id === GLOBAL_ROOM_ID) return -1;
        if (b.room_id === GLOBAL_ROOM_ID) return 1;
        
        return bTime.localeCompare(aTime);
    });

    return (
        <>
            {sortedContacts.length === 0 ? (
                <div 
                    className="text-center py-6 mobile-L:py-8 px-4"
                    style={{ color: theme.colors.textMuted }}
                >
                    <svg 
                        className="w-10 h-10 mobile-L:w-12 mobile-L:h-12 mx-auto mb-2 mobile-L:mb-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: theme.colors.borderLight }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-sm mobile-L:text-base">No conversations yet</p>
                    <p className="text-xs mobile-L:text-sm mt-1">Search for users to start a chat</p>
                </div>
            ) : (
                sortedContacts.map((contact) => (
                    <div
                        key={contact.room_id || contact.userId}
                        className="flex items-center p-3 mobile-L:p-4 cursor-pointer transition-all duration-200 border-l-4"
                        style={{
                            backgroundColor: contact.room_id === activeRoomId ? theme.colors.pastelBgLight : 'transparent',
                            borderLeftColor: contact.room_id === activeRoomId ? theme.colors.primary : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            if (contact.room_id !== activeRoomId) {
                                e.currentTarget.style.backgroundColor = theme.colors.surfaceHover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (contact.room_id !== activeRoomId) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                        onClick={() => handleRoomClick(contact)}
                    >
                        {/* Contact Avatar */}
                        <div className="relative flex-shrink-0">
                            <Avatar className="h-10 w-10 mobile-L:h-12 mobile-L:w-12">
                                <AvatarImage 
                                    src={contact.profilePicUrl || undefined} 
                                    alt={contact.name} 
                                />
                                <AvatarFallback 
                                    className="text-xs mobile-L:text-sm"
                                    style={{
                                        backgroundColor: contact.room_id === GLOBAL_ROOM_ID 
                                            ? theme.colors.success + '20'
                                            : theme.colors.primaryLight,
                                        color: contact.room_id === GLOBAL_ROOM_ID 
                                            ? theme.colors.success
                                            : theme.colors.primaryDark,
                                    }}
                                >
                                    {contact.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {contact.unreadCount > 0 && (
                                <span 
                                    className="absolute -top-1 -right-1 text-white text-[10px] mobile-L:text-xs font-bold px-1 mobile-L:px-1.5 py-0.5 rounded-full min-w-[16px] mobile-L:min-w-[18px] text-center"
                                    style={{ backgroundColor: theme.colors.error }}
                                >
                                    {contact.unreadCount > 99 ? '99+' : contact.unreadCount}
                                </span>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="ml-2 mobile-L:ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p 
                                    className="font-semibold truncate text-sm mobile-L:text-base"
                                    style={{
                                        color: isMessageUnread(contact) ? theme.colors.text : theme.colors.textSecondary,
                                        fontWeight: isMessageUnread(contact) ? 'bold' : 'semibold',
                                    }}
                                >
                                    {contact.name}
                                </p>
                                {contact.lastMessage && (
                                    <p 
                                        className="text-[10px] mobile-L:text-xs flex-shrink-0"
                                        style={{ color: theme.colors.textMuted }}
                                    >
                                        {new Date(contact.lastMessage.created_at).toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                )}
                            </div>
                            <p 
                                className="text-xs mobile-L:text-sm truncate"
                                style={{
                                    color: isMessageUnread(contact) ? theme.colors.text : theme.colors.textMuted,
                                    fontWeight: isMessageUnread(contact) ? 'semibold' : 'normal',
                                }}
                            >
                                {formatLastMessage(contact)}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </>
    );
};