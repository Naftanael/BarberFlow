// src/components/chat/chat-header.tsx
'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatHeaderProps {
  barbershopName: string;
  onClose: () => void;
}

export const ChatHeader = ({ barbershopName, onClose }: ChatHeaderProps) => (
  <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#212121]/80 backdrop-blur-sm shrink-0 z-10">
    <div className="flex items-center space-x-3">
      <Avatar className="h-10 w-10 border-2 border-primary">
        <AvatarImage
          src="https://placehold.co/40x40/B87333/F5F5DC?text=BF"
          alt={barbershopName}
        />
        <AvatarFallback className="bg-primary text-primary-foreground">
          BF
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-headline text-lg tracking-wider text-foreground">
          {barbershopName}
        </p>
        <p className="text-xs text-green-400 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Online
        </p>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="h-8 w-8 text-foreground/70 hover:bg-white/10 hover:text-foreground"
    >
      <X className="h-5 w-5" />
      <span className="sr-only">Fechar chat</span>
    </Button>
  </header>
);
