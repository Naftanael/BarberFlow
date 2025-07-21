// src/components/chat/message-bubble.tsx
'use client';

import { cn } from '@/lib/utils';
import { TypingIndicator } from './typing-indicator';
import type { ReactNode } from 'react';

interface MessageBubbleProps {
  sender: 'user' | 'bot';
  isTyping?: boolean;
  children: ReactNode;
}

export const MessageBubble = ({
  sender,
  isTyping = false,
  children,
}: MessageBubbleProps) => {
  const bubbleClass = cn(
    'rounded-lg px-4 py-2 text-sm font-body shadow-md max-w-[85%]',
    sender === 'user'
      ? 'bg-[#333333] text-[#F5F5F5] rounded-br-none ml-auto'
      : 'bg-[#3D2B1F] text-[#F5F5DC] rounded-bl-none mr-auto'
  );

  return (
    <div
      className={cn(
        'flex items-end gap-2',
        sender === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={bubbleClass}>
        {isTyping ? <TypingIndicator /> : children}
      </div>
    </div>
  );
};
