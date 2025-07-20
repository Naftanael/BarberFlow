"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Olá! Sou seu assistente BarberFlow. Como posso ajudar a agendar seu próximo corte?" },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to bottom of the scrollarea
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
    
    setMessages(prev => [...prev, { from: "user", text }]);
    input.value = "";
    
    setTimeout(() => {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Domingo, 6 = Sábado
        const hour = now.getHours();

        const isWeekendClosed = dayOfWeek === 0; // Fechado no Domingo
        const isOutsideHours = hour < 9 || hour >= 18;

        if (isWeekendClosed || isOutsideHours) {
            setMessages(prev => [...prev, { from: "bot", text: "No momento, a barbearia está fechada. Nosso horário de funcionamento é de segunda a sábado, das 9h às 18h. Por favor, entre em contato durante esse período." }]);
        } else {
            setMessages(prev => [...prev, { from: "bot", text: "Claro! Para qual dia e horário gostaria de agendar?" }]);
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
                <Input id="message" placeholder="Digite sua mensagem..." className="flex-1" autoComplete="off"/>
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </CardFooter>
    </Card>
  );
}
