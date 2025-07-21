// src/components/ChatWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from './chat/chat-header';
import { MessageList, Message } from './chat/message-list';
import { ChatInput } from './chat/chat-input';
import { cn } from '@/lib/utils';
import { getBarbers } from '@/lib/firestore';
import type { Barber } from '@/lib/schemas';

const BARBERSHOP_ID = 'barbershop-1';
const BARBERSHOP_NAME = 'BarberFlow';

const ConversationState = {
  GREETING: 'GREETING',
  ASKING_NAME: 'ASKING_NAME',
  ASKING_PHONE: 'ASKING_PHONE',
  SELECTING_SERVICE: 'SELECTING_SERVICE',
  CLOSED: 'CLOSED',
};

const initialMessage: Message = {
  from: 'bot',
  text: `Olá! Sou o assistente virtual da ${BARBERSHOP_NAME}. Para começar, por favor, me diga seu nome.`,
};

const portugueseDaysOfWeek = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

interface ChatWidgetProps {
  startOpen?: boolean;
  isFloating?: boolean;
}

export default function ChatWidget({
  startOpen = false,
  isFloating = true,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(startOpen);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Começa carregando
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationState, setConversationState] = useState(
    ConversationState.GREETING
  );

  useEffect(() => {
    const checkOpeningHours = async () => {
      try {
        const barbers = await getBarbers(BARBERSHOP_ID);
        let isShopOpen = false;

        const now = new Date();
        const dayOfWeek = portugueseDaysOfWeek[now.getDay()]; // Correctly get day in Portuguese
        const currentTime = now.getHours() + now.getMinutes() / 60;

        for (const barber of barbers) {
          if (!barber.availability || !barber.isActive) continue;

          const isWorkingToday = barber.availability.workDays.includes(
            dayOfWeek
          );
          if (!isWorkingToday) continue;

          const { start, end } = barber.availability.workHours;
          const startTime =
            parseInt(start.split(':')[0]) + parseInt(start.split(':')[1]) / 60;
          const endTime =
            parseInt(end.split(':')[0]) + parseInt(end.split(':')[1]) / 60;

          if (currentTime >= startTime && currentTime < endTime) {
            // Check for breaks
            const isInBreak = barber.availability.breaks.some((breakItem) => {
              const breakStart =
                parseInt(breakItem.start.split(':')[0]) +
                parseInt(breakItem.start.split(':')[1]) / 60;
              const breakEnd =
                parseInt(breakItem.end.split(':')[0]) +
                parseInt(breakItem.end.split(':')[1]) / 60;
              return currentTime >= breakStart && currentTime < breakEnd;
            });

            if (!isInBreak) {
              isShopOpen = true;
              break; // Found an available barber, no need to check others
            }
          }
        }

        if (isShopOpen) {
          setMessages([initialMessage]);
          setConversationState(ConversationState.ASKING_NAME);
        } else {
          setMessages([
            {
              from: 'bot',
              text: `Olá! No momento, todos os nossos barbeiros estão indisponíveis ou estamos fora do nosso horário de funcionamento.`,
            },
          ]);
          setConversationState(ConversationState.CLOSED);
        }
      } catch (error) {
        console.error('Erro ao verificar horário de funcionamento:', error);
        setMessages([
          {
            from: 'bot',
            text: 'Desculpe, estou com problemas para verificar nossos horários. Por favor, tente novamente mais tarde.',
          },
        ]);
        setConversationState(ConversationState.CLOSED);
      } finally {
        setIsLoading(false);
      }
    };

    checkOpeningHours();
  }, []);

  const addMessage = (
    from: 'user' | 'bot',
    text: string,
    options?: string[]
  ) => {
    const newMessage: Message = { from, text, options };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearLastOptions = () => {
    setMessages((prev) => {
      if (prev.length === 0 || !prev[prev.length - 1].options) return prev;
      const newMessages = [...prev];
      delete newMessages[newMessages.length - 1].options;
      return newMessages;
    });
  };

  const handleUserInput = (input: string) => {
    if (conversationState === ConversationState.CLOSED) return;
    clearLastOptions();
    addMessage('user', input);
    setIsTyping(true);
    setTimeout(() => {
      processNextStep(input);
      setIsTyping(false);
    }, 1000);
  };

  const processNextStep = (input: string) => {
    switch (conversationState) {
      case ConversationState.ASKING_NAME:
        addMessage(
          'bot',
          `Obrigado, ${input}! Agora, por favor, me informe seu telefone.`
        );
        setConversationState(ConversationState.ASKING_PHONE);
        break;

      case ConversationState.ASKING_PHONE:
        addMessage('bot', 'Perfeito! Dados registrados.');
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          const serviceNames = ['Corte', 'Barba', 'Corte e Barba'];
          addMessage(
            'bot',
            'Ótimo! Qual serviço você gostaria de agendar?',
            serviceNames
          );
          setConversationState(ConversationState.SELECTING_SERVICE);
        }, 1000);
        break;

      case ConversationState.SELECTING_SERVICE:
        // Lógica futura para seleção de serviço
        break;
    }
  };

  if (!isOpen && isFloating) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50 bg-[#B87333] hover:bg-[#B87333]/90 animate-in fade-in-0 zoom-in-75"
      >
        <Bot className="h-8 w-8 text-white" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden flex flex-col bg-[#212121] bg-[url('/textures/concrete.png')] bg-blend-overlay",
        isFloating
          ? 'fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full h-full md:w-[380px] md:h-[600px] md:rounded-lg shadow-2xl z-50 animate-in fade-in-50 slide-in-from-bottom-10 duration-300'
          : 'w-full h-screen'
      )}
    >
      <ChatHeader
        barbershopName={BARBERSHOP_NAME}
        onClose={() => isFloating && setIsOpen(false)}
      />
      <MessageList
        messages={messages}
        isTyping={isTyping}
        onOptionSelect={handleUserInput}
      />
      <ChatInput
        onSend={handleUserInput}
        isLoading={isLoading || isTyping}
        disabled={isLoading}
      />
    </div>
  );
}
