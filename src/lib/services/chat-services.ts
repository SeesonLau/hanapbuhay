import { supabase } from './supabase/client';
import { toast } from 'react-hot-toast';
import { ProfileService } from './profile-services';

export interface ChatParticipant {
  id: string;
  chat_room_id: string;
  user_id: string;
  joined_at: string;
  profile?: {
    name: string;
    profilePictureUrl: string;
  };
}

export interface Message {
  id: string;
  chat_room_id: string;
  sender_id: string;
  message_text: string;
  message_type: 'text' | 'image' | 'file';
  read_by: string[];
  created_at: string;
  updated_at: string;
  sender_profile?: {
    name: string;
    profilePictureUrl: string;
  };
}

export interface ChatRoom {
  id: string;
  created_at: string;
  updated_at: string;
  last_message: string;
  last_message_at: string;
  participants: ChatParticipant[];
  other_user?: ChatParticipant;
  unread_count?: number;
}

export class ChatService {
  // Get or create a chat room between two users
  static async getOrCreateChatRoom(userId1: string, userId2: string): Promise<string | null> {
    try {
      // Check if chat room already exists by finding common chat rooms
      const { data: user1Rooms, error: user1Error } = await supabase
        .from('chat_participants')
        .select('chat_room_id')
        .eq('user_id', userId1);

      if (user1Error) throw user1Error;

      const { data: user2Rooms, error: user2Error } = await supabase
        .from('chat_participants')
        .select('chat_room_id')
        .eq('user_id', userId2);

      if (user2Error) throw user2Error;

      // Find common chat rooms
      const user1RoomIds = user1Rooms?.map(room => room.chat_room_id) || [];
      const user2RoomIds = user2Rooms?.map(room => room.chat_room_id) || [];
      
      const commonRoomId = user1RoomIds.find(roomId => 
        user2RoomIds.includes(roomId)
      );

      if (commonRoomId) {
        return commonRoomId;
      }

      // Create new chat room
      const { data: newRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({})
        .select('id')
        .single();

      if (roomError) throw roomError;

      // Add participants
      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert([
          { chat_room_id: newRoom.id, user_id: userId1 },
          { chat_room_id: newRoom.id, user_id: userId2 }
        ]);

      if (participantError) throw participantError;

      return newRoom.id;
    } catch (error) {
      console.error('Error creating chat room:', error);
      toast.error('Failed to create chat room');
      return null;
    }
  }

  // Get user's chat rooms
  static async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const { data, error } = await supabase
        .from('chat_participants')
        .select(`
          chat_room_id,
          chat_rooms (
            id,
            created_at,
            updated_at,
            last_message,
            last_message_at
          )
        `)
        .eq('user_id', userId)
        .order('chat_rooms(updated_at)', { ascending: false });

      if (error) throw error;

      const chatRooms = await Promise.all(
        (data || []).map(async (item: any) => {
          const participants = await this.getChatRoomParticipants(item.chat_room_id);
          const otherUser = participants.find(p => p.user_id !== userId);
          
          // Get other user's profile using ProfileService
          if (otherUser) {
            const profileData = await ProfileService.getNameProfilePic(otherUser.user_id);
            if (profileData) {
              otherUser.profile = {
                name: profileData.name || 'Unknown User',
                profilePictureUrl: profileData.profilePicUrl || '/default-avatar.png'
              };
            }
          }

          // Get unread count
          const unreadCount = await this.getUnreadCount(item.chat_room_id, userId);

          return {
            ...item.chat_rooms,
            participants,
            other_user: otherUser,
            unread_count: unreadCount
          };
        })
      );

      return chatRooms;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      toast.error('Failed to load conversations');
      return [];
    }
  }

  // Get chat room participants
  static async getChatRoomParticipants(chatRoomId: string): Promise<ChatParticipant[]> {
    try {
      const { data, error } = await supabase
        .from('chat_participants')
        .select('*')
        .eq('chat_room_id', chatRoomId);

      if (error) throw error;

      // Fetch profiles for all participants using ProfileService
      const participantsWithProfiles = await Promise.all(
        (data || []).map(async (participant) => {
          const profileData = await ProfileService.getNameProfilePic(participant.user_id);
          return {
            ...participant,
            profile: profileData ? {
              name: profileData.name || 'Unknown User',
              profilePictureUrl: profileData.profilePicUrl || '/default-avatar.png'
            } : undefined
          };
        })
      );

      return participantsWithProfiles;
    } catch (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
  }

  // Get messages for a chat room
  static async getMessages(chatRoomId: string, page = 0, pageSize = 50): Promise<Message[]> {
    try {
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Fetch sender profiles using ProfileService
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const profileData = await ProfileService.getNameProfilePic(message.sender_id);
          return {
            ...message,
            sender_profile: profileData ? {
              name: profileData.name || 'Unknown User',
              profilePictureUrl: profileData.profilePicUrl || '/default-avatar.png'
            } : undefined
          };
        })
      );

      return messagesWithProfiles.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
      return [];
    }
  }

  // Send a message
  static async sendMessage(
    chatRoomId: string, 
    senderId: string, 
    messageText: string, 
    messageType: 'text' | 'image' | 'file' = 'text'
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_room_id: chatRoomId,
          sender_id: senderId,
          message_text: messageText,
          message_type: messageType,
          read_by: [senderId] // Mark as read by sender
        })
        .select('*')
        .single();

      if (error) throw error;

      // Fetch sender profile using ProfileService
      const profileData = await ProfileService.getNameProfilePic(senderId);
      
      return {
        ...data,
        sender_profile: profileData ? {
          name: profileData.name || 'Unknown User',
          profilePictureUrl: profileData.profilePicUrl || '/default-avatar.png'
        } : undefined
      };
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return null;
    }
  }

  // Mark messages as read
  static async markAsRead(chatRoomId: string, userId: string): Promise<void> {
    try {
      // First, get all unread messages
      const { data: unreadMessages, error: fetchError } = await supabase
        .from('messages')
        .select('id, read_by')
        .eq('chat_room_id', chatRoomId)
        .neq('sender_id', userId)
        .filter('read_by', 'not.cs', `{${userId}}`);

      if (fetchError) throw fetchError;

      // Update each unread message
      if (unreadMessages && unreadMessages.length > 0) {
        for (const message of unreadMessages) {
          const updatedReadBy = [...(message.read_by || []), userId];
          
          const { error: updateError } = await supabase
            .from('messages')
            .update({ read_by: updatedReadBy })
            .eq('id', message.id);

          if (updateError) throw updateError;
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // Get unread message count for a chat room
  static async getUnreadCount(chatRoomId: string, userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .eq('chat_room_id', chatRoomId)
        .neq('sender_id', userId)
        .filter('read_by', 'not.cs', `{${userId}}`);

      if (error) throw error;

      return data?.length || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Search users to start a chat with - Using direct Supabase query
static async searchUsers(query: string, currentUserId: string): Promise<{
    userId: string;
    name: string;
    profilePictureUrl: string;
  }[]> {
    try {
      // Search profiles by name
      const { data, error } = await supabase
        .from('profiles')
        .select('userId, name, profilePictureUrl')
        .ilike('name', `%${query}%`)
        .neq('userId', currentUserId)
        .limit(10);

      if (error) throw error;

      // Transform the data to match our expected format
      return (data || []).map(profile => ({
        userId: profile.userId,
        name: profile.name || 'Unknown User',
        profilePictureUrl: profile.profilePictureUrl || '/default-avatar.png'
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
  // Subscribe to new messages
  static subscribeToMessages(
    chatRoomId: string, 
    callback: (message: Message) => void
  ) {
    const subscription = supabase
      .channel(`messages:${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`
        },
        async (payload) => {
          const message = payload.new as Message;
          const profileData = await ProfileService.getNameProfilePic(message.sender_id);
          callback({
            ...message,
            sender_profile: profileData ? {
              name: profileData.name || 'Unknown User',
              profilePictureUrl: profileData.profilePicUrl || '/default-avatar.png'
            } : undefined
          });
        }
      )
      .subscribe();

    return subscription;
  }

  // Subscribe to chat room updates
  static subscribeToChatRooms(
    userId: string,
    callback: (update: any) => void
  ) {
    const subscription = supabase
      .channel(`chat_rooms:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms'
        },
        callback
      )
      .subscribe();

    return subscription;
  }
}
