import { supabase } from '@/lib/services/supabase/client';
import { ChatRoom, ChatMessage, UserContact } from '@/lib/models/chat';
import { ProfileService } from '../profile-services';

// The fixed UUID for the global room as set in the SQL script
const GLOBAL_ROOM_ID_UUID = '00000000-0000-0000-0000-000000000000'; 
const MESSAGES_LIMIT = 50; 

export class ChatService {
  // 1. Get or Create a Private Chat Room (DM)
  static async getOrCreatePrivateRoom(currentUserId: string, targetUserId: string): Promise<{ room: ChatRoom, isNew: boolean } | null> {
    try {
      // Sort IDs to ensure consistent array order for the unique index
      const participants = [currentUserId, targetUserId].sort(); 

      // 1. Try to find existing room using the unique index check
      const { data: existingRoom, error: searchError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('type', 'private')
        .contains('participants', participants)
        .limit(1)
        .single();

      if (searchError && searchError.code !== 'PGRST116') { // PGRST116 is 'No rows found'
        return null;
      }

      if (existingRoom) {
        return { room: existingRoom as ChatRoom, isNew: false };
      }

      // 2. If no room found, create a new one
      const { data: newRoomData, error: createError } = await supabase
        .from('chat_rooms')
        .insert({
          type: 'private',
          participants: participants,
        })
        .select('*')
        .single();

      if (createError) {
        return null;
      }

      return { room: newRoomData as ChatRoom, isNew: true };
    } catch (error) {
      console.error('Unexpected error in getOrCreatePrivateRoom:', error);
      return null;
    }
  }
  // Get existing chat rooms for a user
  static async getExistingChatRooms(currentUserId: string): Promise<UserContact[]> {
    try {
      const { data: privateRooms, error: roomsError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('type', 'private')
        .contains('participants', [currentUserId]);

      if (roomsError) {
        return [];
      }

      if (!privateRooms || privateRooms.length === 0) {
        return [];
      }

      const contacts: UserContact[] = [];

      for (const room of privateRooms) {
        const otherParticipantId = room.participants.find((id: string) => id !== currentUserId);
        
        if (!otherParticipantId) continue;

        // Get profile with proper column names
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, profilePictureUrl') // Your actual column names
          .eq('userId', otherParticipantId)
          .single();

        // Get last message
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', room.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        contacts.push({
          userId: otherParticipantId,
          name: profileData?.name || 'Unknown User',
          profilePicUrl: profileData?.profilePictureUrl || null, // Your column name
          unreadCount: 0,
          room_id: room.id,
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            room_id: lastMessage.room_id,
            sender_id: lastMessage.sender_id,
            content: lastMessage.content,
            created_at: lastMessage.created_at,
            is_read_by: lastMessage.is_read_by,
          } : undefined,
        });
      }

      return contacts;
    } catch (error) {
      return [];
    }
  }
  // 2 & 5. Fetch Chat History
  static async getMessageHistory(roomId: string, offset: number = 0, limit: number = MESSAGES_LIMIT): Promise<ChatMessage[]> {
    try {
      // Validate roomId
      if (!roomId) {
        return [];
      }

      const { data, error, status, statusText } = await supabase
        .from('messages')
        .select('*, sender:profiles(name, profilePictureUrl)') 
        .eq('room_id', roomId)
        .order('created_at', { ascending: false }) 
        .range(offset, offset + limit - 1);

      // Handle case where data is null or undefined
      if (!data) {
        return [];
      }

      return (data as any[]).map(msg => ({
        id: msg.id,
        room_id: msg.room_id,
        sender_id: msg.sender_id,
        content: msg.content,
        created_at: msg.created_at,
        is_read_by: msg.is_read_by,
        sender_name: msg.sender?.name || 'Unknown',
        sender_profile_pic_url: msg.sender?.profilePictureUrl,
      })).reverse(); 
    } catch (error) {
      return [];
    }
  }
  // 4. Send a Message
  static async sendMessage(roomId: string, senderId: string, content: string): Promise<ChatMessage | null> {
    try {
      // Validate inputs
      if (!roomId || !senderId || !content?.trim()) {
        return null;
      }
      const { data, error, status, statusText } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          sender_id: senderId,
          content: content.trim(),
          is_read_by: [senderId],
        })
        .select('*, sender:profiles(name, profilePictureUrl)') 
        .single();

      if (error) {
        return null;
      }

      if (!data) {
        return null;
      }
      
      const sentMsg = data as any;
      const chatMessage: ChatMessage = {
        id: sentMsg.id,
        room_id: sentMsg.room_id,
        sender_id: sentMsg.sender_id,
        content: sentMsg.content,
        created_at: sentMsg.created_at,
        is_read_by: sentMsg.is_read_by,
        sender_name: sentMsg.sender?.name || 'Unknown',
        sender_profile_pic_url: sentMsg.sender?.profilePictureUrl,
      };

      // Send notification to recipient (don't await - fire and forget)
      this.notifyRecipient(roomId, senderId, content).catch(err => {
      });

      return chatMessage;
    } catch (error) {
      console.error('Unexpected error in sendMessage:', error);
      return null;
    }
  }

  // Helper method to notify recipient of new message
  private static async notifyRecipient(roomId: string, senderId: string, content: string): Promise<void> {
    try {
      const { notifyNewMessage } = await import('@/lib/utils/notification-helper');
      
      // Get the room to find the recipient
      const { data: room, error } = await supabase
        .from('chat_rooms')
        .select('participants')
        .eq('id', roomId)
        .single();

      if (error || !room) {
        console.error('Failed to fetch room for notification:', error);
        return;
      }

      // Find the recipient (the other participant)
      const recipientId = room.participants.find((id: string) => id !== senderId);
      
      if (!recipientId) {
        console.log('No recipient found for notification');
        return;
      }

      // Send notification
      await notifyNewMessage({
        roomId,
        senderId,
        recipientId,
        messagePreview: content
      });
    } catch (error) {
      console.error('Error in notifyRecipient:', error);
    }
  }

  // 6. Mark Messages as Read
  static async markMessagesAsRead(messageIds: string[], currentUserId: string): Promise<boolean> {
    try {
      for (const id of messageIds) {
        const { error } = await supabase.rpc('mark_message_read', {
          msg_id: id,  // Now this is UUID string
          user_id: currentUserId
        });
        if (error) throw error;
      }
      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }
  // 3. Search Users
  static async searchUsers(query: string, currentUserId: string): Promise<UserContact[]> {
  try {
    // Allow searching with just 1 character
    if (!query || query.trim().length < 1) return [];

    const searchTerm = query.trim().toLowerCase();

    // Use ILIKE for case-insensitive partial matching (searches anywhere in the name)
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('userId, name, profilePictureUrl')
      .ilike('name', `${searchTerm}%`)
      .neq('userId', currentUserId) 
      .limit(10); 

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }

    return (profiles || []).map(p => ({
      userId: p.userId,
      name: p.name || 'Unknown User',
      profilePicUrl: p.profilePictureUrl,
      unreadCount: 0, 
    }));
  } catch (error) {
    console.error('Unexpected error in searchUsers:', error);
    return [];
  }
}
  // Helper to get the constant global room UUID
  static getGlobalRoomId(): string {
    return GLOBAL_ROOM_ID_UUID;
  }
  // Add this temporary method to ChatService to verify the room
static async verifyRoomExists(roomId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('id, type, name')
      .eq('id', roomId)
      .single();
    return !!data && !error;
  } catch (error) {
    console.error('Error verifying room:', error);
    return false;
  }
}
}
