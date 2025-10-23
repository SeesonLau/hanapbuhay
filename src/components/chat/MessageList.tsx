'use client';
import { Message } from '@/lib/services/chat-services';
import { format, isToday, isYesterday } from 'date-fns';
import { shouldShowDate, formatMessageTime } from '@/lib/utils/chat-utils';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const formatDateHeader = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => {
            const showDate = shouldShowDate(
              message.created_at,
              index > 0 ? messages[index - 1].created_at : null
            );

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-6">
                    <span className="bg-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDateHeader(message.created_at)}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                    {message.sender_id !== currentUserId && (
                      <img
                        src={message.sender_profile?.profilePictureUrl || '/default-avatar.png'}
                        alt={message.sender_profile?.name}
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender_id === currentUserId
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm break-words">{message.message_text}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          message.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
