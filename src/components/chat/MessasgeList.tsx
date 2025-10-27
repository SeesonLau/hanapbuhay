// src/components/chat/MessageList.tsx
'use client';

import type { Message } from '@/lib/services/chat/chat-services';
import { ScrollArea } from "@/components/ui/ScrollArea";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

function MessageBubble({ message, isSender }: MessageBubbleProps) {
  const time = format(new Date(message.created_at), 'p');

  return (
    <div className={cn("flex w-full", isSender ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "max-w-[70%] p-3 rounded-xl shadow-sm",
          isSender
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        )}
      >
        <p className="text-sm break-words">{message.content}</p>
        <p className={cn("text-xs mt-1", isSender ? "text-blue-200" : "text-gray-500")}>{time}</p>
      </div>
    </div>
  );
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="h-full flex flex-col p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Say hello to start the conversation!</p>
          </div>
        ) : (
            messages.map((message) => (
              <MessageBubble 
                key={message.id}
                message={message}
                isSender={message.sender_id === currentUserId}
              />
            ))
        )}
    </div>
  );
}