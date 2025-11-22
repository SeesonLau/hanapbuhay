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

  // Real-time subscription
  useEffect(() => {
    if (!roomId || !userId) return

    console.log('🔔 Setting up real-time subscription for room:', roomId)

    const channel = supabase
      .channel(`room-${roomId}`, {
        config: {
          broadcast: { self: false }, // Don't receive our own broadcasts
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          console.log('📨 Raw payload received:', payload)
          const newMsg = payload.new as any
          
          // Skip if this is our own message (already added optimistically)
          if (newMsg.sender_id === userId) {
            console.log('⏩ Skipping own message')
            return
          }

          console.log('📩 Processing incoming message from other user:', newMsg)

          try {
            // Fetch profile data for the sender
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

            console.log('✅ Adding message with profile:', messageWithProfile)
            
            // Add the new message
            setMessages(prev => {
              // Check for duplicates
              const exists = prev.some(msg => msg.id === newMsg.id)
              if (exists) {
                console.log('⚠️ Duplicate detected, skipping')
                return prev
              }
              console.log('✨ Message added to state')
              return [...prev, messageWithProfile]
            })

            // Mark as read
            try {
              await ChatService.markMessagesAsRead([newMsg.id], userId)
              console.log('📖 Marked as read')
            } catch (readError) {
              console.error('Failed to mark as read:', readError)
            }

          } catch (error) {
            console.error('❌ Error fetching profile, adding with fallback:', error)
            
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
      .subscribe((status, err) => {
        console.log('📡 Subscription status:', status, err ? `Error: ${err}` : '')
        
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
          console.log('✅ Successfully subscribed to real-time updates for room:', roomId)
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false)
          console.error('❌ Channel error:', err)
        } else if (status === 'TIMED_OUT') {
          setIsConnected(false)
          console.error('❌ Subscription timed out')
        } else if (status === 'CLOSED') {
          setIsConnected(false)
          console.log('🔒 Channel closed')
        }
      })

    return () => {
      console.log('🧹 Cleaning up subscription for room:', roomId)
      channel.unsubscribe()
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
