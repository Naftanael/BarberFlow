// src/components/chat/option-picker.tsx
'use client';

import { Button } from '@/components/ui/button';

interface OptionPickerProps {
  options: string[];
  onOptionClick: (option: string) => void;
}

export const OptionPicker = ({ options, onOptionClick }: OptionPickerProps) => (
  <div className="flex flex-col gap-2 pt-2">
    {options.map((option) => (
      <Button
        key={option}
        onClick={() => onOptionClick(option)}
        variant="outline"
        className="w-full justify-start rounded-md border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground font-headline uppercase tracking-wider"
      >
        {option}
      </Button>
    ))}
  </div>
);
