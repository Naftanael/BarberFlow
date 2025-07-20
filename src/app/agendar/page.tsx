// src/app/agendar/page.tsx
import ChatWidget from '@/components/chat-widget';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agendamento - BarberFlow',
  description: 'Agende seu horário de forma rápida e fácil.',
};

export default function AgendarPage() {
  return (
    <main className="w-full h-screen bg-[#212121]">
      <ChatWidget startOpen={true} isFloating={false} />
    </main>
  );
}
