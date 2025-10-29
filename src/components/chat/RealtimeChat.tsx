// src/components/chat/RealtimeChat.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/services/supabase/client'
import { ChatMessage } from '@/lib/models/chat'
import { ChatService } from '@/lib/services/chat/chat-services'
import { ProfileService } from '@/lib/services/profile-services'
import { Input } from '@/components/chat/Input'
import Button from '@/components/ui/Button'
import { Preloader } from '@/components/ui/Preloader'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import { 
  FiWifi, 
  FiWifiOff, 
  FiClock, 
  FiCheck, 
  FiCheckCircle,
  FiSend,
  FiMessageSquare
} from 'react-icons/fi'

interface RealtimeChatProps {
  roomId: string
  roomName: string
  username: string
  userId: string
  isGlobal: boolean
  onNewMessage?: (message: ChatMessage) => void
}

export const RealtimeChat: React.FC<RealtimeChatProps> = ({
  roomId,
  roomName,
  username,
  userId,
  isGlobal,
  onNewMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  // Optimized scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Fetch message history only when roomId changes
  useEffect(() => {
    if (!roomId || !userId) return

    const fetchHistory = async () => {
      setIsLoadingHistory(true)
      try {
        console.log('Fetching history for room:', roomId)
        const history = await ChatService.getMessageHistory(roomId)
        console.log('History fetched:', history.length, 'messages')
        setMessages(history)

        // Mark unread messages as read
        const unreadMessageIds = history
          .filter(
            (msg) =>
              msg.sender_id !== userId && !msg.is_read_by?.includes(userId)
          )
          .map((msg) => msg.id)

        if (unreadMessageIds.length > 0) {
          await ChatService.markMessagesAsRead(unreadMessageIds, userId)
        }
      } catch (error) {
        toast.error('Could not load chat history.')
        console.error('Error fetching history:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [roomId, userId])

  // Improved real-time subscription with retry logic
  useEffect(() => {
    if (!roomId || !userId) return

    let channel: any = null
    let retryTimeout: NodeJS.Timeout

    const setupSubscription = () => {
      console.log('Setting up real-time subscription for room:', roomId)
      setSubscriptionStatus('connecting')

      channel = supabase
        .channel(`room-${roomId}-${userId}`, {
          config: {
            broadcast: { self: true },
            presence: { key: roomId }
          }
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
            console.log('New message received via subscription:', payload)
            const newMsg = payload.new as any

            // Skip if this is our own optimistic message
            if (newMsg.sender_id === userId && retryCountRef.current > 0) {
              console.log('Skipping own message from subscription')
              return
            }

            try {
              // Fetch sender profile info
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

              console.log('Adding new message to state:', messageWithProfile)

              // Add the new message to state
              setMessages(prev => {
                const exists = prev.some(msg => msg.id === messageWithProfile.id)
                if (exists) {
                  console.log('Message already in state, not adding duplicate')
                  return prev
                }
                return [...prev, messageWithProfile]
              })

              // Notify parent component about new message for ChatRoomList update
              if (onNewMessage) {
                onNewMessage(messageWithProfile)
              }

              // Auto mark as read if it's from someone else and we're in this room
              if (newMsg.sender_id !== userId) {
                console.log('Marking message as read:', newMsg.id)
                await ChatService.markMessagesAsRead([newMsg.id], userId)
              }
            } catch (error) {
              console.error('Error processing new message:', error)
              // Add message even if profile fetch fails
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

              if (onNewMessage) {
                onNewMessage(fallbackMessage)
              }
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status)
          
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to room:', roomId)
            setSubscriptionStatus('connected')
            retryCountRef.current = 0 // Reset retry count on success
          }
          
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.error('Channel error, attempting to resubscribe...')
            setSubscriptionStatus('error')
            
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++
              console.log(`Retry attempt ${retryCountRef.current} of ${maxRetries}`)
              retryTimeout = setTimeout(() => {
                if (channel) {
                  supabase.removeChannel(channel)
                }
                setupSubscription()
              }, 2000 * retryCountRef.current) // Exponential backoff
            } else {
              console.error('Max retries reached, giving up on subscription')
              toast.error('Real-time connection failed. Messages may be delayed.')
            }
          }
        })
    }

    setupSubscription()

    return () => {
      console.log('Cleaning up subscription for room:', roomId)
      if (retryTimeout) clearTimeout(retryTimeout)
      if (channel) {
        supabase.removeChannel(channel)
      }
      retryCountRef.current = 0
    }
  }, [roomId, userId, onNewMessage])

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  // Optimized send message handler with optimistic updates
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === '' || !userId || !roomId || isSending) {
      return
    }

    const messageContent = newMessage.trim()
    setNewMessage('') // Clear input immediately
    setIsSending(true)

    // Create optimistic message
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: ChatMessage = {
      id: tempId,
      room_id: roomId,
      sender_id: userId,
      content: messageContent,
      created_at: new Date().toISOString(),
      is_read_by: [userId],
      sender_name: username,
      sender_profile_pic_url: null,
    }

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticMessage])

    try {
      console.log('Sending message to server...')
      const sentMessage = await ChatService.sendMessage(
        roomId,
        userId,
        messageContent
      )

      if (sentMessage) {
        console.log('Message sent successfully:', sentMessage)
        // Replace optimistic message with real message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId ? { ...sentMessage } : msg
          )
        )

        // Notify parent about the new sent message
        if (onNewMessage) {
          onNewMessage(sentMessage)
        }
      } else {
        toast.error('Failed to send message. Please try again.')
        console.error('Send message returned null')
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== tempId))
        setNewMessage(messageContent) // Restore the message
      }
    } catch (error) {
      toast.error('Failed to send message.')
      console.error('Error in handleSendMessage:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId))
      setNewMessage(messageContent) // Restore the message
    } finally {
      setIsSending(false)
    }
  }

  // Handle input key press for better UX
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Connection Status Indicator */}
      {subscriptionStatus === 'connecting' && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4 text-sm flex items-center justify-center gap-2">
          <FiWifi className="animate-pulse" />
          <span>Connecting to real-time updates...</span>
        </div>
      )}
      {subscriptionStatus === 'error' && (
        <div className="bg-red-500 text-white text-center py-2 px-4 text-sm flex items-center justify-center gap-2">
          <FiWifiOff />
          <span>Connection issues. Messages may be delayed.</span>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {isLoadingHistory && (
          <Preloader isVisible={true} message="Loading messages..." />
        )}

        {!isLoadingHistory && messages.length === 0 && (
          <div className="text-center text-gray-500 py-8 flex flex-col items-center gap-2">
            <FiMessageSquare className="w-12 h-12 text-gray-300" />
            <p>
              {roomId ? 'No messages yet. Start the conversation!' : 'Select a chat to start messaging'}
            </p>
          </div>
        )}

        {!isLoadingHistory &&
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === userId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                  msg.sender_id === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                } ${msg.id.startsWith('temp-') ? 'opacity-80' : ''}`}
              >
                {msg.sender_id !== userId && (
                  <p className="font-semibold text-sm mb-1">
                    {msg.sender_name}
                  </p>
                )}
                <p>{msg.content}</p>
                <div
                  className={`text-xs mt-1 flex items-center ${
                    msg.sender_id === userId
                      ? 'justify-end text-blue-200'
                      : 'justify-start text-gray-500'
                  }`}
                >
                  {msg.id.startsWith('temp-') ? (
                    <div className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <span>{format(new Date(msg.created_at), 'hh:mm a')}</span>
                      {msg.sender_id === userId && (
                        <div className="flex items-center gap-1 ml-2">
                          {msg.is_read_by?.length > 1 ? (
                            <FiCheckCircle className="w-3 h-3" />
                          ) : (
                            <FiCheck className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder={roomId ? 'Type a message...' : 'Select a chat to start messaging'}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={!userId || !roomId || isSending}
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || !userId || !roomId || isSending}
            className="flex items-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <FiSend className="w-4 h-4" />
                <span>Send</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
