// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Users, Scissors, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ClientOnly } from '@/components/client-only';

const data = [
  { name: 'Seg', faturamento: 400 },
  { name: 'Ter', faturamento: 300 },
  { name: 'Qua', faturamento: 600 },
  { name: 'Qui', faturamento: 800 },
  { name: 'Sex', faturamento: 700 },
  { name: 'Sáb', faturamento: 900 },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [buttonText, setButtonText] = useState('Copiar Link do Chat');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = () => {
    if (!isClient) return;
    const chatUrl = `${window.location.origin}/agendar`;

    const fallbackCopy = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed'; // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          toast({
            title: 'Sucesso!',
            description: 'Link do chatbot copiado para a área de transferência.',
          });
          setButtonText('Copiado!');
          setTimeout(() => setButtonText('Copiar Link do Chat'), 2000);
        } else {
          throw new Error('Copy command was not successful');
        }
      } catch (err) {
        toast({
          title: 'Erro!',
          description: 'Não foi possível copiar o link.',
          variant: 'destructive',
        });
        console.error('Could not copy text: ', err);
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(chatUrl).then(
        () => {
          toast({
            title: 'Sucesso!',
            description: 'Link do chatbot copiado para a área de transferência.',
          });
          setButtonText('Copiado!');
          setTimeout(() => setButtonText('Copiar Link do Chat'), 2000);
        },
        () => {
          fallbackCopy(chatUrl);
        }
      );
    } else {
      fallbackCopy(chatUrl);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline tracking-wider text-foreground">
            Painel Principal
          </h1>
          <p className="text-muted-foreground">
            Visão geral do desempenho da sua barbearia.
          </p>
        </div>
        <Button
          className="font-headline tracking-wider"
          onClick={copyToClipboard}
        >
          <Share2 className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Novos Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">
              +180.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Serviços Realizados
            </CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Faturamento da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientOnly>
            <BarChart width={600} height={300} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="faturamento" fill="#8884d8" />
            </BarChart>
          </ClientOnly>
        </CardContent>
      </Card>
    </div>
  );
}
