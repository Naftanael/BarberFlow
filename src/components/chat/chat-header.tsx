// src/components/chat/ChatHeader.tsx
'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatHeaderProps {
  barbershopName: string;
  onClose: () => void;
}

export const ChatHeader = ({ barbershopName, onClose }: ChatHeaderProps) => (
  <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[#212121]/80 backdrop-blur-sm shrink-0">
    <div className="flex items-center space-x-3">
      <Avatar>
        <AvatarImage
          src="https://placehold.co/40x40/B87333/F5F5DC?text=BF"
          alt={barbershopName}
        />
        <AvatarFallback className="bg-[#B87333] text-[#F5F5DC]">
          BF
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-headline text-lg tracking-wider text-white">
          {barbershopName}
        </p>
        <p className="text-xs text-green-400">Online</p>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="h-8 w-8 text-white hover:bg-white/10"
    >
      <X className="h-5 w-5" />
    </Button>
  </header>
);
