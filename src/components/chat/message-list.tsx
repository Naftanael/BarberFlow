// src/components/chat/message-list.tsx
'use client';

import { useRef, useEffect } from 'react';
import { MessageBubble } from './message-bubble';
import { OptionPicker } from './option-picker';
import type { ReactNode } from 'react';

// Estrutura da Mensagem
export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  options?: ReactNode | string[];
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll para a última mensagem
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const renderMessageContent = (message: Message) => {
    if (Array.isArray(message.options)) {
      return (
        <>
          <p className="mb-2">{message.text}</p>
          <OptionPicker
            options={message.options}
            onOptionClick={onOptionSelect}
          />
        </>
      );
    }
    // Renderiza o nó React (como o Calendário) ou o texto simples
    return message.options || message.text;
  };

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/70 scrollbar-track-secondary">
      {messages.map((message) => (
        <MessageBubble key={message.id} sender={message.sender}>
          {renderMessage-content(message)}
        </MessageBubble>
      ))}
      {isTyping && <MessageBubble sender="bot" isTyping />}
      <div ref={scrollRef} />
    </div>
  );
};
