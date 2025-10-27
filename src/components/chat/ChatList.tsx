// src/components/chat/ChatList.tsx
'use client';

import { ScrollArea } from "@/components/ui/ScrollArea";
import { UserListItem } from "./UserListItem";
import type { ChatRoom } from '@/lib/services/chat/chat-services';

interface ChatListProps {
  chatRooms: ChatRoom[];
  activeChat: string | null;
  onChatSelect: (chatRoomId: string) => void;
  currentUserId: string;
}

export function ChatList({ chatRooms, activeChat, onChatSelect, currentUserId }: ChatListProps) {
  
  // Logic to map ChatRoom data to the UserListItem's expected props
  const getParticipantData = (room: ChatRoom) => {
    // In a 1:1 chat, the other user's data is embedded in the ChatRoom object
    return {
      userId: room.participant_id,
      name: room.participant_name,
      profilePictureUrl: room.participant_picture_url,
      // Pass through chat room details for the list item to display
      ...room, 
    };
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col">
        {chatRooms.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No active conversations yet.</p>
        ) : (
          chatRooms.map((room) => (
            <UserListItem
              key={room.id}
              user={getParticipantData(room)}
              onSelect={() => onChatSelect(room.id)}
              isActive={room.id === activeChat}
              isChatRoom={true}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
