// src/components/chat/ChatInput.tsx
'use client';

import { useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isTyping: boolean;
}

export const ChatInput = ({ onSend, isLoading, isTyping }: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input && input.value) {
      onSend(input.value);
      input.value = '';
    }
  };

  const isDisabled = isLoading || isTyping;

  return (
    <footer className="p-4 border-t border-white/10 bg-[#212121]/80 backdrop-blur-sm shrink-0">
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center space-x-2"
      >
        <Input
          ref={inputRef}
          placeholder={isDisabled ? 'Aguarde...' : 'Digite sua mensagem...'}
          className="flex-1 bg-[#333333] border-none text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#B87333]"
          autoComplete="off"
          disabled={isDisabled}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-[#B87333] hover:bg-[#B87333]/90 text-white shrink-0"
          disabled={isDisabled}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </footer>
  );
};
