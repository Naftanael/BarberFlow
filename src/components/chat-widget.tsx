// src/components/chat-widget.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from './chat/chat-header';
import { MessageList, Message } from './chat/message-list';
import { ChatInput } from './chat/chat-input';
import { cn } from '@/lib/utils';
import {
  getServices,
  getBarbers,
  checkAvailability,
  scheduleAppointment,
} from '@/lib/firestore';
import { Service, Barber } from '@/lib/schemas';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BARBERSHOP_ID = 'barbershop-1';
const BARBERSHOP_NAME = 'BarberFlow';

// --- DEFINIÇÃO DOS ESTADOS DA CONVERSA ---
const ConversationState = {
  INITIAL: 'INITIAL',
  SELECTING_SERVICE: 'SELECTING_SERVICE',
  SELECTING_BARBER: 'SELECTING_BARBER',
  SELECTING_DATE: 'SELECTING_DATE',
  SELECTING_TIME: 'SELECTING_TIME',
  ASKING_NAME: 'ASKING_NAME',
  ASKING_PHONE: 'ASKING_PHONE',
  CONFIRMING_APPOINTMENT: 'CONFIRMING_APPOINTMENT',
  FINALIZED: 'FINALIZED',
};

// --- TIPOS ---
interface ChatWidgetProps {
  startOpen?: boolean;
  isFloating?: boolean;
}

interface AppointmentDetails {
  service?: Service;
  barber?: Barber;
  date?: Date;
  time?: string;
  clientName?: string;
  clientPhone?: string;
}

// --- COMPONENTE PRINCIPAL ---
export default function ChatWidget({
  startOpen = false,
  isFloating = true,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(startOpen);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationState, setConversationState] = useState(
    ConversationState.INITIAL
  );
  const [appointmentDetails, setAppointmentDetails] =
    useState<AppointmentDetails>({});
  const servicesRef = useRef<Service[]>([]);
  const barbersRef = useRef<Barber[]>([]);

  // --- EFEITOS E INICIALIZAÇÃO ---
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage(
        'bot',
        `Olá! Sou o assistente virtual da ${BARBERSHOP_NAME}.`,
        ['Agendar Horário']
      );
    }
  }, [isOpen, messages]);

  useEffect(() => {
    const fetchData = async () => {
      servicesRef.current = await getServices(BARBERSHOP_ID);
      barbersRef.current = await getBarbers(BARBERSHOP_ID);
    };
    fetchData();
  }, []);

  // --- FUNÇÕES AUXILIARES ---
  const addMessage = (
    sender: 'user' | 'bot',
    text: string,
    options?: React.ReactNode | string[]
  ) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender, text, options },
    ]);
  };

  const clearLastOptions = () => {
    setMessages((prev) => {
      if (prev.length === 0 || !prev[prev.length - 1].options) return prev;
      const newMessages = [...prev];
      delete newMessages[newMessages.length - 1].options;
      return newMessages;
    });
  };

  // --- MÁQUINA DE ESTADOS PRINCIPAL ---
  const handleUserInput = (input: string) => {
    clearLastOptions();
    addMessage('user', input);

    setIsTyping(true);
    setTimeout(() => {
      processNextStep(input);
      setIsTyping(false);
    }, 1000);
  };

  const processNextStep = async (input: string) => {
    switch (conversationState) {
      case ConversationState.INITIAL:
        if (input === 'Agendar Horário') {
          const serviceNames = servicesRef.current.map((s) => s.name);
          addMessage(
            'bot',
            'Ótimo! Qual serviço você gostaria de agendar?',
            serviceNames
          );
          setConversationState(ConversationState.SELECTING_SERVICE);
        }
        break;

      case ConversationState.SELECTING_SERVICE:
        const selectedService = servicesRef.current.find(
          (s) => s.name === input
        );
        if (selectedService) {
          setAppointmentDetails({ service: selectedService });
          const barberNames = barbersRef.current
            .filter((b) => b.isActive)
            .map((b) => b.name);
          addMessage(
            'bot',
            'Com qual barbeiro você gostaria de agendar?',
            barberNames
          );
          setConversationState(ConversationState.SELECTING_BARBER);
        }
        break;

      case ConversationState.SELECTING_BARBER:
        const selectedBarber = barbersRef.current.find(
          (b) => b.name === input
        );
        if (selectedBarber) {
          setAppointmentDetails((prev) => ({ ...prev, barber: selectedBarber }));
          addMessage(
            'bot',
            'Perfeito. Agora, por favor, escolha uma data.',
            <Calendar
              mode="single"
              onSelect={(date) =>
                date && handleUserInput(format(date, 'yyyy-MM-dd'))
              }
              disabled={(date) => date < new Date()}
              locale={ptBR}
            />
          );
          setConversationState(ConversationState.SELECTING_DATE);
        }
        break;

      case ConversationState.SELECTING_DATE:
        const selectedDate = new Date(input);
        setAppointmentDetails((prev) => ({ ...prev, date: selectedDate }));
        addMessage('bot', 'Verificando horários disponíveis...');
        setIsLoading(true);

        const availableTimes = await checkAvailability(
          BARBERSHOP_ID,
          appointmentDetails.service!.id!,
          appointmentDetails.barber!.id!,
          selectedDate
        );
        setIsLoading(false);

        if (availableTimes.length > 0) {
          addMessage(
            'bot',
            `Encontrei os seguintes horários para ${format(
              selectedDate,
              'dd/MM'
            )}:`,
            availableTimes
          );
          setConversationState(ConversationState.SELECTING_TIME);
        } else {
          addMessage(
            'bot',
            'Desculpe, não há horários disponíveis para esta data. Por favor, escolha outra.'
          );
          setConversationState(ConversationState.SELECTING_BARBER);
          handleUserInput(appointmentDetails.barber!.name);
        }
        break;

      case ConversationState.SELECTING_TIME:
        setAppointmentDetails((prev) => ({ ...prev, time: input }));
        addMessage('bot', 'Para finalizar, qual é o seu nome completo?');
        setConversationState(ConversationState.ASKING_NAME);
        break;

      case ConversationState.ASKING_NAME:
        setAppointmentDetails((prev) => ({ ...prev, clientName: input }));
        addMessage('bot', 'E qual é o seu número de telefone (com DDD)?');
        setConversationState(ConversationState.ASKING_PHONE);
        break;

      case ConversationState.ASKING_PHONE:
        const finalDetails = { ...appointmentDetails, clientPhone: input };
        setAppointmentDetails(finalDetails);

        const summary = `
          Serviço: ${finalDetails.service!.name}
          Barbeiro: ${finalDetails.barber!.name}
          Data: ${format(finalDetails.date!, 'dd/MM/yyyy')}
          Hora: ${finalDetails.time}
          Nome: ${finalDetails.clientName}
          Telefone: ${finalDetails.clientPhone}
        `;
        addMessage('bot', `Por favor, confirme os detalhes:
${summary}`, [
          'Confirmar Agendamento',
        ]);
        setConversationState(ConversationState.CONFIRMING_APPOINTMENT);
        break;

      case ConversationState.CONFIRMING_APPOINTMENT:
        if (input === 'Confirmar Agendamento') {
          addMessage('bot', 'Confirmando sua reserva...');
          setIsLoading(true);
          try {
            const startTime = new Date(appointmentDetails.date!);
            const [hour, minute] = appointmentDetails.time!.split(':');
            startTime.setHours(parseInt(hour), parseInt(minute));

            const endTime = new Date(
              startTime.getTime() +
                appointmentDetails.service!.duration * 60000
            );

            await scheduleAppointment({
              barbershopId: BARBERSHOP_ID,
              serviceId: appointmentDetails.service!.id!,
              barberId: appointmentDetails.barber!.id!,
              clientName: appointmentDetails.clientName!,
              clientPhone: appointmentDetails.clientPhone!,
              startTime,
              endTime,
            });
            addMessage(
              'bot',
              'Agendamento confirmado com sucesso! Mal podemos esperar para te ver.'
            );
          } catch (error) {
            console.error('Erro ao agendar:', error);
            addMessage(
              'bot',
              'Desculpe, não foi possível confirmar seu agendamento. Por favor, tente novamente.'
            );
          } finally {
            setIsLoading(false);
            setConversationState(ConversationState.FINALIZED);
          }
        }
        break;
    }
  };

  if (!isOpen && isFloating) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90 animate-in fade-in-0 zoom-in-75"
      >
        <Bot className="h-8 w-8 text-primary-foreground" />
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
        disabled={isLoading || isTyping}
      />
    </div>
  );
}
