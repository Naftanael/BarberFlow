// src/components/chat/MessageBubble.tsx
'use client';

import { cn } from '@/lib/utils';
import { TypingIndicator } from './typing-indicator';

interface MessageBubbleProps {
  from: 'user' | 'bot';
  text?: string;
  isTyping?: boolean;
}

export const MessageBubble = ({
  from,
  text,
  isTyping = false,
}: MessageBubbleProps) => {
  const bubbleClass = cn(
    'rounded-lg px-4 py-2 text-sm font-body shadow-md max-w-[85%]',
    from === 'user'
      ? 'bg-[#333333] text-[#F5F5F5] rounded-br-none ml-auto'
      : 'bg-[#3D2B1F] text-[#F5F5DC] rounded-bl-none mr-auto'
  );

  return (
    <div
      className={cn(
        'flex items-end gap-2',
        from === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={bubbleClass}>
        {isTyping ? <TypingIndicator /> : <p>{text}</p>}
      </div>
    </div>
  );
};
