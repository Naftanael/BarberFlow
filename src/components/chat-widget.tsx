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
import { TimePicker } from './chat/time-picker';

const BARBERSHOP_ID = 'barbershop-1';
const BARBERSHOP_NAME = 'BarberFlow';

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

interface AppointmentDetails {
  service: Service;
  barber: Barber;
  date: Date;
  time: string;
  clientName: string;
  clientPhone: string;
}

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
  const appointmentDetailsRef = useRef<Partial<AppointmentDetails>>({});
  const servicesRef = useRef<Service[]>([]);
  const barbersRef = useRef<Barber[]>([]);

  useEffect(() => {
    const initializeChat = async () => {
      if (isOpen && messages.length === 0) {
        setIsLoading(true);
        try {
          servicesRef.current = await getServices(BARBERSHOP_ID);
          barbersRef.current = await getBarbers(BARBERSHOP_ID);
          addMessage('bot', `Olá! Sou o assistente virtual da ${BARBERSHOP_NAME}.`, ['Agendar Horário']);
        } catch (error) {
          addMessage('bot', 'Desculpe, estou com problemas para iniciar. Tente novamente mais tarde.');
          setConversationState(ConversationState.FINALIZED);
        } finally {
          setIsLoading(false);
        }
      }
    };
    initializeChat();
  }, [isOpen, messages.length]);

  const addMessage = (
    sender: 'user' | 'bot',
    text: string,
    options?: React.ReactNode
  ) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender, text, options },
    ]);
  };

  const clearLastOptions = () => {
    setMessages((prev) => {
      const newMessages = [...prev];
      if (newMessages.length > 0) {
        delete newMessages[newMessages.length - 1].options;
      }
      return newMessages;
    });
  };

  const restartDateSelection = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    addMessage(
      'bot',
      'Por favor, escolha uma nova data.',
      <Calendar
        mode="single"
        onSelect={(date) => date && handleUserInput(format(date, 'yyyy-MM-dd'))}
        disabled={(date) => date < today}
        locale={ptBR}
      />
    );
    setConversationState(ConversationState.SELECTING_DATE);
  };

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
          addMessage('bot', 'Qual serviço você gostaria de agendar?', serviceNames);
          setConversationState(ConversationState.SELECTING_SERVICE);
        }
        break;

      case ConversationState.SELECTING_SERVICE: {
        const selectedService = servicesRef.current.find((s) => s.name === input);
        if (selectedService) {
          appointmentDetailsRef.current = { service: selectedService };
          const barberNames = barbersRef.current.filter((b) => b.isActive).map((b) => b.name);
          addMessage('bot', 'Com qual barbeiro?', barberNames);
          setConversationState(ConversationState.SELECTING_BARBER);
        }
        break;
      }

      case ConversationState.SELECTING_BARBER: {
        const selectedBarber = barbersRef.current.find((b) => b.name === input);
        if (selectedBarber) {
          if (selectedBarber.availability) {
            appointmentDetailsRef.current.barber = selectedBarber;
            restartDateSelection();
          } else {
            addMessage('bot', `Desculpe, ${selectedBarber.name} ainda não configurou seus horários.`);
            const barberNames = barbersRef.current.filter((b) => b.isActive).map((b) => b.name);
            addMessage('bot', 'Por favor, escolha outro barbeiro.', barberNames);
            setConversationState(ConversationState.SELECTING_BARBER);
          }
        }
        break;
      }

      case ConversationState.SELECTING_DATE: {
        const [year, month, day] = input.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);

        appointmentDetailsRef.current.date = selectedDate;
        addMessage('bot', 'Verificando horários...');
        setIsLoading(true);

        try {
          const { service, barber } = appointmentDetailsRef.current;
          const availableTimes = await checkAvailability(BARBERSHOP_ID, service!.id!, barber!.id!, selectedDate);
          
          if (availableTimes.length > 0) {
            addMessage('bot', `Encontrei estes horários para ${format(selectedDate, 'dd/MM')}:`, <TimePicker times={availableTimes} onTimeSelect={handleUserInput} />);
            setConversationState(ConversationState.SELECTING_TIME);
          } else {
            addMessage('bot', 'Desculpe, não há horários disponíveis para esta data.');
            restartDateSelection();
          }
        } catch (error) {
          console.error("Erro ao verificar disponibilidade:", error);
          addMessage('bot', 'Desculpe, ocorreu um erro. Por favor, reinicie a conversa.');
          setConversationState(ConversationState.FINALIZED);
        } finally {
          setIsLoading(false);
        }
        break;
      }

      case ConversationState.SELECTING_TIME:
        appointmentDetailsRef.current.time = input;
        addMessage('bot', 'Qual é o seu nome?');
        setConversationState(ConversationState.ASKING_NAME);
        break;

      case ConversationState.ASKING_NAME:
        appointmentDetailsRef.current.clientName = input;
        addMessage('bot', 'E seu telefone com DDD?');
        setConversationState(ConversationState.ASKING_PHONE);
        break;

      case ConversationState.ASKING_PHONE: {
        appointmentDetailsRef.current.clientPhone = input;
        const finalDetails = appointmentDetailsRef.current as AppointmentDetails;
        const summary = `Serviço: ${finalDetails.service.name}
Barbeiro: ${finalDetails.barber.name}
Data: ${format(finalDetails.date, 'dd/MM/yyyy')}
Hora: ${finalDetails.time}
Nome: ${finalDetails.clientName}
Telefone: ${finalDetails.clientPhone}`;
        addMessage('bot', `Confirme os detalhes:

${summary}`, ['Confirmar Agendamento']);
        setConversationState(ConversationState.CONFIRMING_APPOINTMENT);
        break;
      }

      case ConversationState.CONFIRMING_APPOINTMENT: {
        if (input === 'Confirmar Agendamento') {
          addMessage('bot', 'Confirmando sua reserva...');
          setIsLoading(true);
          try {
            const { service, barber, date, time, clientName, clientPhone } = appointmentDetailsRef.current as AppointmentDetails;
            const startTime = new Date(date);
            const [hour, minute] = time.split(':');
            startTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
            const endTime = new Date(startTime.getTime() + service.duration * 60000);

            await scheduleAppointment({
              barbershopId: BARBERSHOP_ID,
              serviceId: service.id!,
              barberId: barber.id!,
              clientName,
              clientPhone,
              startTime,
              endTime,
            });
            addMessage('bot', 'Agendamento confirmado com sucesso!');
          } catch (error) {
            console.error('Erro ao agendar:', error);
            addMessage('bot', 'Desculpe, não foi possível confirmar seu agendamento.');
          } finally {
            setIsLoading(false);
            setConversationState(ConversationState.FINALIZED);
          }
        }
        break;
      }
    }
  };

  if (!isOpen && isFloating) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90">
        <Bot className="h-8 w-8 text-primary-foreground" />
      </Button>
    );
  }

  return (
    <div className={cn('overflow-hidden flex flex-col bg-[#212121]', isFloating ? 'fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full h-full md:w-[380px] md:h-[600px] md:rounded-lg shadow-2xl z-50' : 'w-full h-screen')}>
      <ChatHeader barbershopName={BARBERSHOP_NAME} onClose={() => isFloating && setIsOpen(false)} />
      <MessageList messages={messages} isTyping={isTyping} onOptionSelect={handleUserInput} />
      <ChatInput onSend={handleUserInput} isLoading={isLoading || isTyping} disabled={isLoading || isTyping} />
    </div>
  );
}
