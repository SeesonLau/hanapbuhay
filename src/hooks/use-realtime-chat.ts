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
            
            // Otherwise fetch profile data with display name
            try {
              const displayName = await ProfileService.getDisplayNameByUserId(msg.sender_id)
              const profileData = await ProfileService.getNameProfilePic(msg.sender_id)
              return {
                ...msg,
                sender_name: displayName || profileData?.name || 'Unknown',
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
          console.log('Current userId:', userId)
          console.log('Message sender_id:', newMsg.sender_id)
          
          // Skip if this is our own message (already added optimistically)
          if (newMsg.sender_id === userId) {
            console.log('⏩ Skipping own message')
            return
          }

          console.log('👤 Message is from another user, processing...')

          // First, check if message already exists
          let messageExists = false
          setMessages(prev => {
            messageExists = prev.some(msg => msg.id === newMsg.id)
            if (messageExists) {
              console.log('⚠️ Message already exists in state')
            }
            return prev // Don't modify state yet
          })

          if (messageExists) {
            console.log('⏩ Skipping duplicate message')
            return
          }

          console.log('✨ New message from other user, fetching profile...')

          try {
            // Fetch display name and profile data
            const displayName = await ProfileService.getDisplayNameByUserId(newMsg.sender_id)
            const profileData = await ProfileService.getNameProfilePic(newMsg.sender_id)
            console.log('📋 Display name fetched:', displayName)
            console.log('📋 Profile data fetched:', profileData)
            
            const messageWithProfile: ChatMessage = {
              id: newMsg.id,
              room_id: newMsg.room_id,
              sender_id: newMsg.sender_id,
              content: newMsg.content,
              created_at: newMsg.created_at,
              is_read_by: newMsg.is_read_by || [],
              sender_name: displayName || profileData?.name || 'Unknown',
              sender_profile_pic_url: profileData?.profilePicUrl,
            }

            console.log('✅ Adding message to state:', messageWithProfile)
            
            // Add the message to state
            setMessages(prev => {
              // Final duplicate check before adding
              const stillExists = prev.some(msg => msg.id === newMsg.id)
              if (stillExists) {
                console.log('⚠️ Race condition: message appeared while fetching profile')
                return prev
              }
              console.log('🎉 Message successfully added!')
              return [...prev, messageWithProfile]
            })

            // Mark as read
            try {
              await ChatService.markMessagesAsRead([newMsg.id], userId)
              console.log('📖 Marked message as read')
            } catch (readError) {
              console.error('⚠️ Failed to mark as read:', readError)
            }

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
            
            console.log('⚠️ Adding fallback message:', fallbackMessage)
            
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
          console.log('❌ Subscription status:', status)
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