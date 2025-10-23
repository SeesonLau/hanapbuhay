'use client';
import { ChatRoom } from '@/lib/services/chat-services';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  chatRooms: ChatRoom[];
  activeChat: string | null;
  onChatSelect: (chatRoomId: string) => void;
  currentUserId: string;
}

export default function ChatList({ 
  chatRooms, 
  activeChat, 
  onChatSelect, 
  currentUserId 
}: ChatListProps) {
  if (chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <div className="w-16 h-16 mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-center">No conversations yet</p>
        <p className="text-sm text-center mt-1">Start a new conversation by searching for users</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {chatRooms.map((chatRoom) => {
        const otherUser = chatRoom.other_user;
        if (!otherUser) return null;

        const lastMessageTime = formatDistanceToNow(new Date(chatRoom.updated_at), { 
          addSuffix: true 
        });

        return (
          <div
            key={chatRoom.id}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
              activeChat === chatRoom.id 
                ? 'bg-blue-50 border-blue-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onChatSelect(chatRoom.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex-shrink-0">
                <img
                  src={otherUser.profile?.profilePictureUrl || '/default-avatar.png'}
                  alt={otherUser.profile?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {otherUser.profile?.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {lastMessageTime}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 truncate mb-1">
                  {chatRoom.last_message || 'No messages yet'}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {chatRoom.unread_count && chatRoom.unread_count > 0 
                      ? `${chatRoom.unread_count} unread message${chatRoom.unread_count > 1 ? 's' : ''}`
                      : 'All caught up'
                    }
                  </span>
                  {chatRoom.unread_count && chatRoom.unread_count > 0 && (
                    <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                      {chatRoom.unread_count}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
