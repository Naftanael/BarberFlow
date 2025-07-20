// src/components/ChatWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFlow } from '@genkit-ai/next/client';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from './chat/chat-header';
import { MessageList, Message } from './chat/message-list';
import { ChatInput } from './chat/chat-input';
import { getServicesFlow } from '../ai/genkit';
import { cn } from '@/lib/utils';

const BARBERSHOP_NAME = 'BarberFlow';
const BARBERSHOP_ID = 'barberShop123';

const ConversationState = {
  GREETING: 'GREETING',
  ASKING_NAME: 'ASKING_NAME',
  ASKING_PHONE: 'ASKING_PHONE',
  SELECTING_SERVICE: 'SELECTING_SERVICE',
  CLOSED: 'CLOSED'
};

const initialMessage: Message = {
  from: 'bot',
  text: `Olá! Sou o assistente virtual da ${BARBERSHOP_NAME}. Para começar, por favor, me diga seu nome.`,
};

interface ChatWidgetProps {
  startOpen?: boolean;
  isFloating?: boolean;
}

export default function ChatWidget({ startOpen = false, isFloating = true }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(startOpen);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [conversationState, setConversationState] = useState(ConversationState.ASKING_NAME);
  const [userData, setUserData] = useState({ name: '', phone: '' });

  const { run: runGetServices, data: services, error } = useFlow(getServicesFlow);

  useEffect(() => {
    // Check for opening hours
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    const isClosed = dayOfWeek === 0 || hour < 9 || hour >= 18;

    if (isClosed) {
      setMessages([
        {
          from: 'bot',
          text: `Olá! Nosso horário de funcionamento é de Segunda a Sábado, das 9h às 18h. No momento estamos fechados.`,
        },
      ]);
      setConversationState(ConversationState.CLOSED);
    } else {
        setMessages([initialMessage])
        setConversationState(ConversationState.ASKING_NAME);
    }
  }, []);

  useEffect(() => {
    if (conversationState === ConversationState.SELECTING_SERVICE && services) {
        setIsLoading(false);
        const serviceNames = services.map(s => s.name);
        addMessage('bot', 'Ótimo! Qual serviço você gostaria de agendar?', serviceNames);
    }
     if (error) {
        setIsLoading(false);
        addMessage('bot', 'Desculpe, não consegui carregar os serviços no momento. Tente novamente mais tarde.');
        console.error("Erro ao buscar serviços:", error);
    }
  }, [services, error, conversationState]);

  const addMessage = (from: 'user' | 'bot', text: string, options?: string[]) => {
    const newMessage: Message = { from, text, options };
    setMessages((prev) => [...prev, newMessage]);
  };
  
  const clearLastOptions = () => {
    setMessages(prev => {
        if (prev.length === 0 || !prev[prev.length - 1].options) return prev;
        const newMessages = [...prev];
        delete newMessages[newMessages.length - 1].options;
        return newMessages;
    });
  }

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
        setUserData(prev => ({ ...prev, name: input }));
        addMessage('bot', `Obrigado, ${input}! Agora, por favor, me informe seu telefone.`);
        setConversationState(ConversationState.ASKING_PHONE);
        break;
      
      case ConversationState.ASKING_PHONE:
        setUserData(prev => ({ ...prev, phone: input }));
        addMessage('bot', 'Perfeito! Dados registrados.');
        setIsLoading(true);
        addMessage('bot', 'Buscando os serviços disponíveis...');
        setConversationState(ConversationState.SELECTING_SERVICE);
        runGetServices({ barbershopId: BARBERSHOP_ID });
        break;

      case ConversationState.SELECTING_SERVICE:
        // Future logic for service selection
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
    <div className={cn(
        "overflow-hidden flex flex-col bg-[#212121] bg-[url('/textures/concrete.png')] bg-blend-overlay",
        isFloating 
            ? "fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full h-full md:w-[380px] md:h-[600px] md:rounded-lg shadow-2xl z-50 animate-in fade-in-50 slide-in-from-bottom-10 duration-300"
            : "w-full h-screen"
    )}>
      <ChatHeader 
        barbershopName={BARBERSHOP_NAME} 
        onClose={() => isFloating && setIsOpen(false)} 
      />
      <MessageList
        messages={messages}
        isTyping={isTyping}
        onOptionSelect={handleUserInput}
      />
      <ChatInput onSend={handleUserInput} isLoading={isLoading} isTyping={isTyping} />
    </div>
  );
}
