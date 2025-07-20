// src/components/chat/MessageList.tsx
'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';
import { OptionPicker } from './option-picker';
import { useEffect, useRef } from 'react';

export interface Message {
  from: 'user' | 'bot';
  text: string;
  options?: string[];
}

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onOptionSelect: (option: string) => void;
}

export const MessageList = ({
  messages,
  isTyping,
  onOptionSelect,
}: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 space-y-6">
        {messages.map((msg, index) => (
          <div key={index}>
            <MessageBubble from={msg.from} text={msg.text} />
            {msg.options && (
              <OptionPicker options={msg.options} onSelect={onOptionSelect} />
            )}
          </div>
        ))}
        {isTyping && <MessageBubble from="bot" isTyping />}
      </div>
    </ScrollArea>
  );
};
