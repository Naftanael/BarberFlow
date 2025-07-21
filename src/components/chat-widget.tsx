// src/components/ChatWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from './chat/chat-header';
import { MessageList, Message } from './chat/message-list';
import { ChatInput } from './chat/chat-input';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
    const fetchAvailabilityAndCheckHours = async () => {
      try {
        const availabilityRef = doc(
          db,
          'barbershops',
          BARBERSHOP_ID,
          'availability',
          'default' // Assumindo que a disponibilidade padrão tem o id 'default'
        );
        const docSnap = await getDoc(availabilityRef);

        let isClosed = true; // Começa como fechado por padrão
        let closedMessage = `Olá! No momento estamos fechados. Por favor, verifique nossos horários de funcionamento.`;

        if (docSnap.exists()) {
          const availabilityData = docSnap.data();
          const now = new Date();
          const dayOfWeek = now.getDay(); // 0 = Domingo
          const currentHour = now.getHours() + now.getMinutes() / 60;

          const today = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
          ][dayOfWeek];

          const schedule = availabilityData.days[today];

          if (schedule && schedule.isOpen) {
            const openTime =
              parseInt(schedule.open.split(':')[0]) +
              parseInt(schedule.open.split(':')[1]) / 60;
            const closeTime =
              parseInt(schedule.close.split(':')[0]) +
              parseInt(schedule.close.split(':')[1]) / 60;

            if (currentHour >= openTime && currentHour < closeTime) {
              isClosed = false;
            } else {
              closedMessage = `Olá! Hoje nosso horário é das ${schedule.open} às ${schedule.close}. No momento estamos fechados.`;
            }
          } else {
            closedMessage = `Olá! Hoje não estamos abertos.`;
          }
        }

        if (isClosed) {
          setMessages([{ from: 'bot', text: closedMessage }]);
          setConversationState(ConversationState.CLOSED);
        } else {
          setMessages([initialMessage]);
          setConversationState(ConversationState.ASKING_NAME);
        }
      } catch (error) {
        console.error('Erro ao buscar disponibilidade:', error);
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

    fetchAvailabilityAndCheckHours();
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
