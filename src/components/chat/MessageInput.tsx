// src/components/chat/MessageInput.tsx
'use client';

import { useState } from 'react';
import Textarea from "@/components/ui/TextArea";
import Button  from "@/components/ui/Button";
import { Import, Send } from 'lucide-react';
import { Spinner } from '@/components/chat/Spinner';

interface MessageInputProps {
  onSendMessage: (messageText: string) => Promise<void>;
  disabled: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (message.trim() && !disabled) {
      const text = message.trim();
      setMessage(''); // Clear input immediately
      await onSendMessage(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Shift + Enter for new line, otherwise check for Enter to send
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in textarea
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-end space-x-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          disabled={disabled}
          className="min-h-[40px] resize-none pr-10"
        />
        <Button 
          type="submit" 
          onClick={handleSend} 
          disabled={disabled || !message.trim()}
          className="h-10 w-10 p-0 shrink-0"
        >
          {disabled ? <Spinner size="sm" className="text-white" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
