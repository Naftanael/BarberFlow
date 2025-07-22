// src/components/chat/time-picker.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  times: string[];
  onTimeSelect: (time: string) => void;
}

export const TimePicker = ({ times, onTimeSelect }: TimePickerProps) => {
  if (times.length === 0) {
    return null;
  }

  return (
    <div className="pt-2">
      <div className="grid grid-cols-3 gap-2">
        {times.map((time) => (
          <Button
            key={time}
            variant="outline"
            className="font-headline tracking-wider text-lg bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground h-12"
            onClick={() => onTimeSelect(time)}
          >
            <Clock className="mr-2 h-4 w-4" />
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};
