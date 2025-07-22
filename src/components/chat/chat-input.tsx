// src/components/chat/chat-input.tsx
'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (textarea && textarea.value.trim()) {
      onSend(textarea.value.trim());
      textarea.value = '';
      textarea.style.height = 'auto'; // Reset height
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const handleInput = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      textarea.addEventListener('input', handleInput);
      return () => textarea.removeEventListener('input', handleInput);
    }
  }, []);

  return (
    <footer className="p-4 border-t border-white/10 bg-[#212121]/80 backdrop-blur-sm shrink-0 z-10">
      <form onSubmit={handleSubmit} className="flex w-full items-end space-x-2">
        <Textarea
          ref={textareaRef}
          placeholder={disabled ? 'Aguarde...' : 'Digite sua mensagem...'}
          className="flex-1 bg-[#333333] border-none text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary resize-none max-h-32"
          autoComplete="off"
          disabled={disabled}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
          disabled={disabled}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="sr-only">Enviar mensagem</span>
        </Button>
      </form>
    </footer>
  );
};
