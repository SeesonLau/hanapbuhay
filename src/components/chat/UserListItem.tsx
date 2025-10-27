// src/components/chat/UserListItem.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { SearchResult, ChatRoom } from '@/lib/services/chat/chat-services';
import { format } from 'date-fns';

type UserData = SearchResult & Partial<ChatRoom>; // Can be used for search or a full chat room

interface UserListItemProps {
  user: UserData;
  onSelect: () => void;
  isActive?: boolean;
  isChatRoom?: boolean;
}

export function UserListItem({ user, onSelect, isActive = false, isChatRoom = false }: UserListItemProps) {
  const name = user.name || user.participant_name || 'Unknown User';
  const profilePictureUrl = user.profilePictureUrl || user.participant_picture_url;
  const fallback = name.substring(0, 2).toUpperCase();
  const unreadCount = isChatRoom ? (user.unread_count || 0) : 0;
  const lastMessage = isChatRoom ? user.last_message_content : null;
  const lastMessageTime = isChatRoom && user.last_message_at ? format(new Date(user.last_message_at), 'p') : null;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex items-center space-x-3 p-4 cursor-pointer transition-colors border-b",
        isActive ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' : 'hover:bg-gray-50 border-gray-100',
        user.userId // Use userId for SearchResult, id for ChatRoom
          ? 'rounded-lg' // Search result item styling
          : 'rounded-none' // Chat list item styling
      )}
    >
      <Avatar className="h-12 w-12">
        {profilePictureUrl ? (
          <AvatarImage src={profilePictureUrl} alt={name} />
        ) : (
          <AvatarFallback className="bg-blue-500 text-white">{fallback}</AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold text-gray-800 truncate">{name}</p>
          {isChatRoom && lastMessageTime && (
            <span className={cn("text-xs", unreadCount > 0 ? "text-blue-600 font-bold" : "text-gray-500")}>
              {lastMessageTime}
            </span>
          )}
        </div>
        
        {isChatRoom && (
          <div className="flex justify-between items-center mt-1">
            <p className={cn("text-sm truncate pr-2", unreadCount > 0 ? "font-medium text-gray-800" : "text-gray-600")}>
              {lastMessage || "Start a conversation."}
            </p>
            {unreadCount > 0 && (
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}