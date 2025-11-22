// src/components/chat/ChatMessage.tsx
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
  showHeader: boolean
}

export const ChatMessageItem = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
  return (
    <div className={cn(
      'flex',
      'mt-1.5 mobile-L:mt-2',
      isOwnMessage ? 'justify-end' : 'justify-start'
    )}>
      <div
        className={cn(
          // Responsive max widths
          'max-w-[85%] mobile-M:max-w-[80%] mobile-L:max-w-[75%] tablet:max-w-[70%] laptop:max-w-[65%]',
          'w-fit flex flex-col',
          'gap-0.5 mobile-L:gap-1',
          {
            'items-end': isOwnMessage,
          }
        )}
      >
        {showHeader && (
          <div
            className={cn(
              'flex items-center',
              'gap-1.5 mobile-L:gap-2',
              'text-[10px] mobile-L:text-xs',
              'px-2 mobile-L:px-3',
              {
                'justify-end flex-row-reverse': isOwnMessage,
              }
            )}
          >
            <span className="font-medium truncate max-w-[120px] mobile-L:max-w-[150px]">
              {message.sender_name}
            </span>
            <span className="text-foreground/50 text-[10px] mobile-L:text-xs whitespace-nowrap flex-shrink-0">
              {new Date(message.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>
        )}
        <div
          className={cn(
            // Responsive padding and text
            'py-1.5 mobile-L:py-2 tablet:py-2.5',
            'px-2.5 mobile-L:px-3 tablet:px-4',
            'rounded-xl mobile-L:rounded-2xl',
            'text-xs mobile-L:text-sm tablet:text-base',
            'break-words overflow-wrap-anywhere',
            'leading-relaxed',
            // Touch target - ensure minimum tappable area
            'min-h-[36px] mobile-L:min-h-[40px]',
            'flex items-center',
            // Ensure text wraps properly
            'max-w-full',
            'word-break',
            isOwnMessage 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
          )}
        >
          <span className="inline-block max-w-full break-all">{message.content}</span>
        </div>
      </div>
    </div>
  )
}