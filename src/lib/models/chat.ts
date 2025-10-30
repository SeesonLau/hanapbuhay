export interface ChatRoom {
  id: string;
  type: 'private' | 'global';
  name: string | null;
  participants: string[] | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read_by: string[];
  // Joined profile data for display
  sender_name?: string;
  sender_profile_pic_url?: string | null;
}

export interface UserContact {
  userId: string;
  name: string;
  profilePicUrl: string | null;
  // Chat Room related data
  lastMessage?: ChatMessage;
  unreadCount: number;
  room_id?: string; // The ID of the DM room, if it exists
}
