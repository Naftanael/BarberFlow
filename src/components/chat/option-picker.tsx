// src/components/chat/OptionPicker.tsx
'use client';

import { Button } from '@/components/ui/button';

interface OptionPickerProps {
  options: string[];
  onSelect: (option: string) => void;
}

export const OptionPicker = ({ options, onSelect }: OptionPickerProps) => (
  <div className="mt-3 flex flex-col gap-2 max-w-[85%] mr-auto">
    {options.map((option, i) => (
      <Button
        key={i}
        onClick={() => onSelect(option)}
        variant="outline"
        className="w-full h-auto py-2 bg-transparent border-copper text-copper hover:bg-copper hover:text-white font-headline uppercase tracking-wider text-xs"
      >
        {option}
      </Button>
    ))}
  </div>
);
