// src/app/agendar/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agendamento - BarberFlow',
  description: 'Agende seu horário de forma rápida e fácil.',
};

export default function AgendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
