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
  FiClock, 
  FiCheck, 
  FiCheckCircle,
  FiSend,
  FiMessageSquare
} from 'react-icons/fi'
import { useRealtimeChat } from '@/hooks/use-realtime-chat'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useTheme } from '@/hooks/useTheme'

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
  const { theme } = useTheme()
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  // useRealtimeChat already fetches display names via ProfileService.getDisplayNameByUserId
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  // Helper to get display name for rendering
  // message.sender_name is already formatted by useRealtimeChat using ProfileService.getDisplayNameByUserId
  const getDisplayName = (message: ChatMessage): string => {
    if (message.sender_id === userId) {
      return 'You'
    }
    // Use the display name that's already formatted in the message
    return message.sender_name || 'Unknown'
  }

  const renderMessageItem = (message: ChatMessage, index: number) => {
    const isCurrentUser = message.sender_id === userId
    const prevMessage = index > 0 ? messages[index - 1] : null
    
    const isFirstInSequence = !prevMessage || 
      prevMessage.sender_id !== message.sender_id ||
      new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() > 300000
    
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
    const isLastInSequence = !nextMessage || 
      nextMessage.sender_id !== message.sender_id ||
      new Date(nextMessage.created_at).getTime() - new Date(message.created_at).getTime() > 300000

    const marginClass = !isLastInSequence && nextMessage?.sender_id === message.sender_id 
      ? 'mb-0.5 mobile-L:mb-1' 
      : 'mb-2 mobile-L:mb-3'

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

    const displayName = getDisplayName(message)

    return (
      <div
        key={message.id}
        className={`flex items-end ${marginClass} ${
          isCurrentUser ? 'justify-end' : 'justify-start'
        }`}
      >
        {!isCurrentUser && isFirstInSequence && (
          <div className="flex-shrink-0 mr-1.5 mobile-L:mr-2 self-end">
            <Avatar className="h-6 w-6 mobile-L:h-8 mobile-L:w-8">
              <AvatarImage 
                src={message.sender_profile_pic_url || undefined} 
                alt={displayName} 
              />
              <AvatarFallback 
                className="text-[10px] mobile-L:text-xs"
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.textSecondary,
                }}
              >
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        {!isCurrentUser && !isFirstInSequence && (
          <div className="w-6 mobile-L:w-8 mr-1.5 mobile-L:mr-2 flex-shrink-0" />
        )}

        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[85%] mobile-M:max-w-[80%] mobile-L:max-w-[75%] tablet:max-w-[70%]`}>
          {(isGlobal || !isCurrentUser) && isFirstInSequence && (
            <p 
              className="text-[10px] mobile-L:text-xs font-medium mb-0.5 mobile-L:mb-1 px-1 truncate max-w-full"
              style={{
                color: isCurrentUser ? theme.colors.primary : theme.colors.textSecondary,
              }}
            >
              {displayName}
            </p>
          )}
          
          <div
            className={`px-2.5 mobile-L:px-3 tablet:px-4 py-1.5 mobile-L:py-2 shadow-sm max-w-full ${borderRadiusClass} ${message.id.startsWith('temp-') ? 'opacity-80' : ''}`}
            style={{
              backgroundColor: isCurrentUser ? theme.colors.primary : theme.colors.backgroundSecondary,
              color: isCurrentUser ? '#ffffff' : theme.colors.text,
            }}
          >
            <p className="break-all overflow-wrap-anywhere text-xs mobile-L:text-sm tablet:text-base leading-relaxed">{message.content}</p>
            
            {isLastInSequence && (
              <div
                className="text-[10px] mobile-L:text-xs mt-0.5 mobile-L:mt-1 flex items-center gap-1"
                style={{
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                  color: isCurrentUser ? 'rgba(255, 255, 255, 0.7)' : theme.colors.textMuted,
                }}
              >
                <span className="whitespace-nowrap">{formatMessageTime(message.created_at)}</span>
                {isCurrentUser && (
                  <>
                    {message.id.startsWith('temp-') ? (
                      <FiClock className="w-2.5 h-2.5 mobile-L:w-3 mobile-L:h-3 animate-pulse flex-shrink-0" />
                    ) : message.is_read_by && message.is_read_by.length > 1 ? (
                      <FiCheckCircle className="w-2.5 h-2.5 mobile-L:w-3 mobile-L:h-3 flex-shrink-0" />
                    ) : (
                      <FiCheck className="w-2.5 h-2.5 mobile-L:w-3 mobile-L:h-3 flex-shrink-0" />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {isCurrentUser && isFirstInSequence && (
          <div className="flex-shrink-0 ml-1.5 mobile-L:ml-2 self-end">
            <Avatar className="h-6 w-6 mobile-L:h-8 mobile-L:w-8">
              <AvatarImage 
                src={message.sender_profile_pic_url || undefined} 
                alt="You" 
              />
              <AvatarFallback 
                className="text-[10px] mobile-L:text-xs"
                style={{
                  backgroundColor: theme.colors.primaryLight,
                  color: theme.colors.primaryDark,
                }}
              >
                {username?.substring(0, 2).toUpperCase() || 'YO'}
              </AvatarFallback>
            </Avatar>
          </div>
        )}  

        {isCurrentUser && !isFirstInSequence && (
          <div className="w-6 mobile-L:w-8 ml-1.5 mobile-L:ml-2 flex-shrink-0" />
        )}
      </div>
    )
  }

  return (
    <div 
      className="flex flex-col h-full w-full"
      style={{ backgroundColor: theme.colors.surface }}
    >
      {!isConnected && (
        <div 
          className="text-white text-center py-1.5 mobile-L:py-2 px-3 mobile-L:px-4 text-xs mobile-L:text-sm flex items-center justify-center gap-2 flex-shrink-0"
          style={{ backgroundColor: theme.colors.warning }}
        >
          <FiWifi className="animate-pulse" />
          <span>Connecting...</span>
        </div>
      )}

      <div ref={containerRef} className="flex-1 overflow-y-auto p-3 mobile-L:p-4 min-h-0">
        {isLoading && (
          <div className="flex justify-center py-4">
            <Preloader isVisible={true} message="Loading..." />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div 
            className="text-center py-6 mobile-L:py-8 flex flex-col items-center gap-2"
            style={{ color: theme.colors.textMuted }}
          >
            <FiMessageSquare 
              className="w-10 h-10 mobile-L:w-12 mobile-L:h-12"
              style={{ color: theme.colors.borderLight }}
            />
            <p className="text-base mobile-L:text-lg font-medium">No messages yet</p>
            <p className="text-xs mobile-L:text-sm">
              {roomId ? 'Start the conversation!' : 'Select a chat to start messaging'}
            </p>
          </div>
        )}

        <div className="space-y-0.5 mobile-L:space-y-1">
          {!isLoading && messages.map((message, index) => (
            <div key={message.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderMessageItem(message, index)}
            </div>
          ))}
        </div>
      </div>

      <form 
        onSubmit={handleSendMessage} 
        className="flex w-full items-center gap-2 p-2 mobile-L:p-3 tablet:p-4 flex-shrink-0"
        style={{ borderTop: `1px solid ${theme.colors.border}` }}
      >
        <Input
          type="text"
          placeholder={roomId ? 'Type a message...' : 'Select a chat'}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 text-sm mobile-L:text-base"
          disabled={!userId || !roomId || isSending || !isConnected}
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim() || !userId || !roomId || isSending || !isConnected}
          className="flex items-center justify-center gap-2 px-3 mobile-L:px-4 h-10 mobile-L:h-10 tablet:h-11 min-w-[44px] mobile-L:min-w-[48px]"
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiSend className="w-4 h-4" />
          )}
          <span className="hidden mobile-L:inline"></span>
        </Button>
      </form>
    </div>
  )
}