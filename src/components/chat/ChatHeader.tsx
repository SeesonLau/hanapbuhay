// src/components/chat/ChatHeader.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { ChatRoom } from '@/lib/services/chat/chat-services';

interface ChatHeaderProps {
  chatRoom: ChatRoom;
  currentUserId: string;
}

export function ChatHeader({ chatRoom }: ChatHeaderProps) {
  const otherUserName = chatRoom.participant_name || 'Chat Partner';
  const otherUserPic = chatRoom.participant_picture_url;
  const fallback = otherUserName.substring(0, 2).toUpperCase();

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          {otherUserPic ? (
            <AvatarImage src={otherUserPic} alt={otherUserName} />
          ) : (
            <AvatarFallback className="bg-gray-300 text-gray-700">{fallback}</AvatarFallback>
          )}
        </Avatar>
        <h3 className="text-lg font-semibold text-gray-800">{otherUserName}</h3>
      </div>
      {/* Optional: Add active status indicator here */}
    </div>
  );
}
