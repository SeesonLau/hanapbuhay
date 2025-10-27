// src/lib/services/chat/chat-services.ts

import { createClient } from '@/lib/services/supabase/client'; 
// Import RealtimeChannel and types from the Supabase JS library
import type { RealtimeChannel } from '@supabase/supabase-js'; 


// ===================================
// 1. DATA TYPES
// ===================================

export interface Message {
  id: string;
  sender_id: string;
  room_id: string;
  content: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  participant_id: string; // The ID of the other user in the 1:1 chat
  participant_name: string;
  participant_picture_url: string | null;
  last_message_content: string;
  last_message_at: string;
  unread_count: number;
}

export interface SearchResult {
    userId: string;
    name: string;
    profilePictureUrl: string | null;
}

// Define the shape of the data returned by the search query
type ProfileRow = {
  userId: string; 
  name: string; 
  profilePictureUrl: string | null;
}


// ===================================
// 2. CHAT SERVICE CLASS
// ===================================

export class ChatService {
  
  // FIX: Use a static getter for correct access and initialization of the client
  private static get supabase() {
    return createClient();
  }

  // -----------------------------------
  // A. USER SEARCH FUNCTIONALITY (Working)
  // -----------------------------------

  /**
   * Searches the 'profiles' table for users matching the query by name.
   * Excludes the currently authenticated user.
   */
  static async searchUsers(query: string, currentUserId: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return []; 
    }
      
    try {
        const { data, error } = await ChatService.supabase
          .from('profiles')
          .select(`
            userId, 
            name, 
            profilePictureUrl
          `)
          .ilike('name', `%${query.trim()}%`)
          .neq('userId', currentUserId)
          .limit(20); 

        if (error) {
          console.error('Supabase Query Error:', error); 
          throw new Error(error.message || 'Supabase query failed');
        }

        // FIX: Explicitly type the data array and the map parameter
        const profileData = data as ProfileRow[] | null;

        if (!profileData) {
            return [];
        }
        
        return profileData.map((profile: ProfileRow) => ({
          userId: profile.userId,
          name: profile.name,
          profilePictureUrl: profile.profilePictureUrl,
        }));
        
    } catch (e) {
        console.error("Search failed:", e);
        return [];
    }
  }

  // -----------------------------------
  // B. CONVERSATION MANAGEMENT (STUBS)
  // -----------------------------------

  /**
   * STUB: Fetches the user's list of active chat rooms (conversations).
   * NOTE: This requires tables like 'conversations' and 'participants'.
   */
  static async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    console.log('STUB: Fetching chat rooms for user:', userId);
    // TODO: Implement Supabase RPC or complex query to join participants, 
    // last message, and unread counts.
    return []; // Returns an empty array until implemented
  }

  /**
   * STUB: Fetches the historical messages for a given chat room.
   */
  static async getMessages(chatRoomId: string): Promise<Message[]> {
    console.log('STUB: Fetching messages for room:', chatRoomId);
    // TODO: Implement Supabase query on the 'messages' table, ordered by created_at.
    return []; // Returns an empty array until implemented
  }

  /**
   * STUB: Marks all messages in a chat room as read for the current user.
   */
  static markAsRead(chatRoomId: string, userId: string) {
    console.log(`STUB: Marking room ${chatRoomId} as read for user ${userId}`);
    // TODO: Implement Supabase update/insert logic (e.g., in a 'read_receipts' table).
  }
  
  // -----------------------------------
  // C. SENDING AND REALTIME (STUBS)
  // -----------------------------------

  /**
   * STUB: Inserts a new message into the database and broadcasts it.
   */
  static async sendMessage(chatRoomId: string, senderId: string, content: string): Promise<Message | null> {
    console.log('STUB: Sending message to room:', chatRoomId);
    
    // 1. Insert message into the 'messages' table (for persistence)
    // 2. Broadcast a message via Supabase Realtime (for immediate delivery)
    
    // Example STUB return for immediate local update:
    return {
      id: crypto.randomUUID(),
      sender_id: senderId,
      room_id: chatRoomId,
      content: content,
      created_at: new Date().toISOString(),
    };
  }

  /**
   * STUB: Subscribes to real-time updates for a user's chat rooms (e.g., when a new room is created).
   */
  static subscribeToChatRooms(userId: string, callback: () => void): RealtimeChannel {
      console.log('STUB: Subscribing to chat room updates');
      // TODO: Implement Supabase Realtime subscription on the 'participants' table 
      // where the user is involved.
      
      // Return a mock channel with an unsubscribe method
      return { unsubscribe: () => console.log('STUB: Unsubscribed from rooms') } as unknown as RealtimeChannel;
  }
  
  /**
   * STUB: Subscribes to real-time message updates for a specific room.
   */
  static subscribeToMessages(chatRoomId: string, callback: (message: Message) => void): RealtimeChannel {
      console.log(`STUB: Subscribing to messages for room: ${chatRoomId}`);
      // TODO: Implement Supabase Realtime subscription on the 'messages' table 
      // filtered by room_id.
      
      // Return a mock channel with an unsubscribe method
      return { unsubscribe: () => console.log('STUB: Unsubscribed from messages') } as unknown as RealtimeChannel;
  }
}