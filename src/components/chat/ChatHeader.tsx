'use client';
import { ChatRoom } from '@/lib/services/chat-services';

interface ChatHeaderProps {
  chatRoom: ChatRoom;
  currentUserId: string;
}

export default function ChatHeader({ chatRoom, currentUserId }: ChatHeaderProps) {
  const otherUser = chatRoom.other_user;

  if (!otherUser) return null;

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-3">
        <img
          src={otherUser.profile?.profilePictureUrl || '/default-avatar.png'}
          alt={otherUser.profile?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{otherUser.profile?.name}</h3>
          <p className="text-sm text-gray-600">Online</p>
        </div>
      </div>
    </div>
  );
}
