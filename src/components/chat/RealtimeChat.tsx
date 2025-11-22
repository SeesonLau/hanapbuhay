'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { ChatMessage } from '@/lib/models/chat'
import { Input } from '@/components/chat/input'
import Button from '@/components/ui/Button'
import { Preloader } from '@/components/ui/Preloader'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { format, isToday, isYesterday } from 'date-fns'
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
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import { useChatScroll } from '@/hooks/use-chat-scroll'

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
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  // Use the custom hooks
  const { 
    messages, 
    sendMessage, 
    isConnected, 
    isLoading 
  } = useRealtimeChat({
    roomId,
    userId,
    username
  })

  const { containerRef, scrollToBottom } = useChatScroll([messages])
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom('instant')
    }
  }, [isLoading, messages.length, scrollToBottom])
  // Format message time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd');
    }
  };

  // Handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === '' || !userId || !roomId || isSending || !isConnected) {
      return
    }

    setIsSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('')

    try {
      const sentMessage = await sendMessage(messageContent)
      
      if (sentMessage && onNewMessage) {
        onNewMessage(sentMessage)
      } else if (!sentMessage) {
        toast.error('Failed to send message. Please try again.')
        setNewMessage(messageContent)
      }
    } catch (error) {
      toast.error('Failed to send message.')
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }

  // Handle input key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  // Render message item
  const renderMessageItem = (message: ChatMessage, index: number) => {
    const isCurrentUser = message.sender_id === userId
    const prevMessage = index > 0 ? messages[index - 1] : null
    
    // Check if this is the first message in a consecutive sequence
    const isFirstInSequence = !prevMessage || 
      prevMessage.sender_id !== message.sender_id ||
      new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() > 300000
    
    // Check if this is the last message in a consecutive sequence
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
    const isLastInSequence = !nextMessage || 
      nextMessage.sender_id !== message.sender_id ||
      new Date(nextMessage.created_at).getTime() - new Date(message.created_at).getTime() > 300000

    // Determine margin between messages
    const marginClass = !isLastInSequence && nextMessage?.sender_id === message.sender_id 
      ? 'mb-1' 
      : 'mb-3'

    // Determine border radius
    let borderRadiusClass = ''
    if (isFirstInSequence && isLastInSequence) {
      borderRadiusClass = isCurrentUser ? 'rounded-2xl rounded-br-lg' : 'rounded-2xl rounded-bl-lg'
    } else if (isFirstInSequence) {
      borderRadiusClass = isCurrentUser ? 'rounded-t-2xl rounded-l-2xl rounded-br-lg' : 'rounded-t-2xl rounded-r-2xl rounded-bl-lg'
    } else if (isLastInSequence) {
      borderRadiusClass = isCurrentUser ? 'rounded-b-2xl rounded-l-2xl rounded-tr-lg' : 'rounded-b-2xl rounded-r-2xl rounded-tl-lg'
    } else {
      borderRadiusClass = isCurrentUser ? 'rounded-l-2xl rounded-br-lg rounded-tr-lg' : 'rounded-r-2xl rounded-bl-lg rounded-tl-lg'
    }

    return (
      <div
        key={message.id}
        className={`flex items-end ${marginClass} ${
          isCurrentUser ? 'justify-end' : 'justify-start'
        }`}
      >
        {/* Profile picture for other users (left side) */}
        {!isCurrentUser && isFirstInSequence && (
          <div className="flex-shrink-0 mr-2 self-end">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={message.sender_profile_pic_url || undefined} 
                alt={message.sender_name} 
              />
              <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
                {message.sender_name?.substring(0, 2).toUpperCase() || '??'}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {/* Empty space for alignment when no profile picture is shown */}
        {!isCurrentUser && !isFirstInSequence && (
          <div className="w-8 mr-2 flex-shrink-0" />
        )}

        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[calc(100%-40px)]`}>
          {/* Show sender name only for first message in sequence */}
          {(isGlobal || !isCurrentUser) && isFirstInSequence && (
            <p className={`text-xs font-medium mb-1 px-1 ${
              isCurrentUser ? 'text-blue-600' : 'text-gray-600'
            }`}>
              {isCurrentUser ? 'You' : message.sender_name}
            </p>
          )}
          
          {/* Message bubble */}
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 shadow-sm ${
              isCurrentUser
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            } ${borderRadiusClass} ${message.id.startsWith('temp-') ? 'opacity-80' : ''}`}
          >
            <p className="break-words">{message.content}</p>
            
            {/* Only show timestamp and status for last message in sequence */}
            {isLastInSequence && (
              <div
                className={`text-xs mt-1 flex items-center gap-1 ${
                  isCurrentUser
                    ? 'justify-end text-blue-200'
                    : 'justify-start text-gray-500'
                }`}
              >
                <span>{formatMessageTime(message.created_at)}</span>
                {isCurrentUser && (
                  <>
                    {message.id.startsWith('temp-') ? (
                      <FiClock className="w-3 h-3 animate-pulse" />
                    ) : message.is_read_by && message.is_read_by.length > 1 ? (
                      <FiCheckCircle className="w-3 h-3" />
                    ) : (
                      <FiCheck className="w-3 h-3" />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile picture for current user (right side) */}
        {isCurrentUser && isFirstInSequence && (
          <div className="flex-shrink-0 ml-2 self-end">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={message.sender_profile_pic_url || undefined} 
                alt="You" 
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                {username?.substring(0, 2).toUpperCase() || 'YO'}
              </AvatarFallback>
            </Avatar>
          </div>
        )}  

        {/* Empty space for alignment for current user non-first messages */}
        {isCurrentUser && !isFirstInSequence && (
          <div className="w-8 ml-2 flex-shrink-0" />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4 text-sm flex items-center justify-center gap-2">
          <FiWifi className="animate-pulse" />
          <span>Connecting to real-time updates...</span>
        </div>
      )}

      {isConnected ? (
        <div className="bg-green-500 text-white text-center py-1 px-4 text-xs">
          ✅ Real-time connected
        </div>
      ) : (
        <div className="bg-red-500 text-white text-center py-1 px-4 text-xs">
          ❌ Real-time disconnected
        </div>
      )}

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex justify-center py-4">
            <Preloader isVisible={true} message="Loading messages..." />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="text-center text-gray-500 py-8 flex flex-col items-center gap-2">
            <FiMessageSquare className="w-12 h-12 text-gray-300" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">
              {roomId ? 'Start the conversation!' : 'Select a chat to start messaging'}
            </p>
          </div>
        )}

        <div className="space-y-1">
          {!isLoading && messages.map((message, index) => (
            <div key={message.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderMessageItem(message, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex w-full gap-2 border-t border-gray-200 p-4">
        <Input
          type="text"
          placeholder={roomId ? 'Type a message...' : 'Select a chat to start messaging'}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
          disabled={!userId || !roomId || isSending || !isConnected}
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim() || !userId || !roomId || isSending || !isConnected}
          className="flex items-center gap-2 px-4"
          size="sm"
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiSend className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
