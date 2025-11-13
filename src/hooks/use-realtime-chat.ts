'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/services/supabase/client'
import { ChatService } from '@/lib/services/chat/chat-services'
import { ProfileService } from '@/lib/services/profile-services'
import { ChatMessage as ModelChatMessage } from '@/lib/models/chat'

interface UseRealtimeChatProps {
  roomId: string
  userId: string
  username: string
}

export type ChatMessage = ModelChatMessage

export function useRealtimeChat({ roomId, userId, username }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial messages
  useEffect(() => {
    if (!roomId || !userId) return

    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const history = await ChatService.getMessageHistory(roomId)
        
        // Enhance messages with profile data
        const enhancedMessages = await Promise.all(
          history.map(async (msg) => {
            // If we already have profile data, use it
            if (msg.sender_name && msg.sender_name !== 'Unknown') {
              return msg
            }
            
            // Otherwise fetch profile data
            try {
              const profileData = await ProfileService.getNameProfilePic(msg.sender_id)
              return {
                ...msg,
                sender_name: profileData?.name || 'Unknown',
                sender_profile_pic_url: profileData?.profilePicUrl,
              }
            } catch (error) {
              console.error('Error fetching profile for message:', error)
              return {
                ...msg,
                sender_name: 'Unknown',
                sender_profile_pic_url: null,
              }
            }
          })
        )
        
        setMessages(enhancedMessages)

        // Mark unread messages as read
        const unreadMessageIds = enhancedMessages
          .filter(msg => msg.sender_id !== userId && !msg.is_read_by?.includes(userId))
          .map(msg => msg.id)

        if (unreadMessageIds.length > 0) {
          await ChatService.markMessagesAsRead(unreadMessageIds, userId)
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [roomId, userId])

  // Real-time subscription - FIXED VERSION
  useEffect(() => {
    if (!roomId || !userId) return

    console.log('🔔 Setting up real-time subscription for room:', roomId)

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any
          console.log('📨 New message received via real-time:', newMsg)
          
          // Skip if this is our own optimistic message (check by sender_id)
          if (newMsg.sender_id === userId) {
            console.log('⏩ Skipping own message')
            return
          }

          try {
            // Check if message already exists (prevents duplicates)
            setMessages(prev => {
              const exists = prev.some(msg => msg.id === newMsg.id)
              if (exists) {
                console.log('⏩ Message already exists, skipping')
                return prev
              }
              return prev
            })

            const profileData = await ProfileService.getNameProfilePic(newMsg.sender_id)
            
            const messageWithProfile: ChatMessage = {
              id: newMsg.id,
              room_id: newMsg.room_id,
              sender_id: newMsg.sender_id,
              content: newMsg.content,
              created_at: newMsg.created_at,
              is_read_by: newMsg.is_read_by || [],
              sender_name: profileData?.name || 'Unknown',
              sender_profile_pic_url: profileData?.profilePicUrl,
            }

            console.log('✅ Adding new message to state:', messageWithProfile)
            
            setMessages(prev => {
              const exists = prev.some(msg => msg.id === messageWithProfile.id)
              if (exists) return prev
              return [...prev, messageWithProfile]
            })

            // Mark as read immediately
            await ChatService.markMessagesAsRead([newMsg.id], userId)
            console.log('📖 Marked message as read')

          } catch (error) {
            console.error('❌ Error processing new message:', error)
            // Fallback: add message without profile data
            const fallbackMessage: ChatMessage = {
              id: newMsg.id,
              room_id: newMsg.room_id,
              sender_id: newMsg.sender_id,
              content: newMsg.content,
              created_at: newMsg.created_at,
              is_read_by: newMsg.is_read_by || [],
              sender_name: 'Unknown',
              sender_profile_pic_url: null,
            }
            
            setMessages(prev => {
              const exists = prev.some(msg => msg.id === fallbackMessage.id)
              if (exists) return prev
              return [...prev, fallbackMessage]
            })
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          console.log('✅ Successfully subscribed to real-time updates')
        } else {
          setIsConnected(false)
          console.log('❌ Subscription failed:', status)
        }
      })

    return () => {
      console.log('🧹 Cleaning up subscription for room:', roomId)
      supabase.removeChannel(channel)
      setIsConnected(false)
    }
  }, [roomId, userId])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!roomId || !userId || !content.trim()) return null

      console.log('📤 Sending message:', content)

      // Create optimistic message
      const tempId = `temp-${Date.now()}`
      const optimisticMessage: ChatMessage = {
        id: tempId,
        room_id: roomId,
        sender_id: userId,
        content: content.trim(),
        created_at: new Date().toISOString(),
        is_read_by: [userId],
        sender_name: username,
        sender_profile_pic_url: null,
      }

      // Add optimistic message immediately
      setMessages(prev => [...prev, optimisticMessage])

      try {
        const sentMessage = await ChatService.sendMessage(roomId, userId, content)
        
        if (sentMessage) {
          console.log('✅ Message sent successfully:', sentMessage)
          // Replace optimistic message with real message
          setMessages(prev => 
            prev.map(msg => 
              msg.id === tempId ? { ...sentMessage, sender_name: username } : msg
            )
          )
          return sentMessage
        } else {
          console.log('❌ Failed to send message')
          // Remove optimistic message on failure
          setMessages(prev => prev.filter(msg => msg.id !== tempId))
          return null
        }
      } catch (error) {
        console.error('❌ Error sending message:', error)
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempId))
        return null
      }
    },
    [roomId, userId, username]
  )

  return { 
    messages, 
    sendMessage, 
    isConnected, 
    isLoading
  }
}
