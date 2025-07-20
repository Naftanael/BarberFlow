"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

const CHAT_STATE = {
  AWAITING_NAME: "AWAITING_NAME",
  AWAITING_PHONE: "AWAITING_PHONE",
  SCHEDULING: "SCHEDULING",
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState(CHAT_STATE.AWAITING_NAME);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Olá! Sou seu assistente BarberFlow. Para começar, qual é o seu nome?" },
  ]);
  const [userName, setUserName] = useState("");
  const [placeholder, setPlaceholder] = useState("Digite seu nome...");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.message as HTMLInputElement;
    const text = input.value;
    if (!text) return;
    
    const userMessage = { from: "user", text };
    setMessages(prev => [...prev, userMessage]);
    input.value = "";
    
    setTimeout(() => {
        const now = new Date();
        const dayOfWeek = now.getDay(); 
        const hour = now.getHours();

        const isClosed = dayOfWeek === 0 || hour < 9 || hour >= 18;

        if (isClosed) {
            setMessages(prev => [...prev, { from: "bot", text: "No momento, a barbearia está fechada. Nosso horário de funcionamento é de segunda a sábado, das 9h às 18h. Por favor, entre em contato durante esse período." }]);
            return;
        }

        if (chatState === CHAT_STATE.AWAITING_NAME) {
            setUserName(text);
            setMessages(prev => [...prev, { from: "bot", text: `Obrigado, ${text}! Agora, por favor, me informe seu telefone.` }]);
            setChatState(CHAT_STATE.AWAITING_PHONE);
            setPlaceholder("Digite seu telefone...");
        } else if (chatState === CHAT_STATE.AWAITING_PHONE) {
             setMessages(prev => [...prev, { from: "bot", text: `Perfeito, ${userName}! Para qual dia e horário você gostaria de agendar?` }]);
             setChatState(CHAT_STATE.SCHEDULING);
             setPlaceholder("Ex: Amanhã às 14h");
        } else if (chatState === CHAT_STATE.SCHEDULING) {
             setMessages(prev => [...prev, { from: "bot", text: "Ok! Estou verificando a disponibilidade... Um momento." }]);
        }
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50"
      >
        <Bot className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-[28rem] flex flex-col shadow-lg z-50 animate-in fade-in-50 slide-in-from-bottom-10 duration-500">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" alt="Bot" data-ai-hint="robot mascot" />
                    <AvatarFallback>BF</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium leading-none font-headline tracking-wide">Assistente</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4"/>
            </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={cn("flex items-end gap-2", msg.from === "user" ? "justify-end" : "justify-start")}>
                            {msg.from === "bot" && <Avatar className="h-6 w-6"><AvatarFallback>BF</AvatarFallback></Avatar>}
                            <div className={cn("max-w-[75%] rounded-lg px-3 py-2 text-sm", msg.from === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 border-t">
            <form onSubmit={handleSend} className="flex w-full items-center space-x-2">
                <Input id="message" placeholder={placeholder} className="flex-1" autoComplete="off"/>
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </CardFooter>
    </Card>
  );
}
