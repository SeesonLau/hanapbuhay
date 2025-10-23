import { ChatService } from '@/lib/services/chat-services';

export async function startChatWithUser(currentUserId: string, otherUserId: string): Promise<string | null> {
  const chatRoomId = await ChatService.getOrCreateChatRoom(currentUserId, otherUserId);
  return chatRoomId;
}

export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

export function shouldShowDate(current: string, previous: string | null): boolean {
  if (!previous) return true;
  
  const currentDate = new Date(current).toDateString();
  const previousDate = new Date(previous).toDateString();
  
  return currentDate !== previousDate;
}
