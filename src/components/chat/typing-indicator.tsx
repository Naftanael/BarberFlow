// src/components/chat/TypingIndicator.tsx
'use client';

export const TypingIndicator = () => (
  <div className="flex items-center gap-2">
    <span className="text-xs">Digitando</span>
    <div className="flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </div>
  </div>
);
