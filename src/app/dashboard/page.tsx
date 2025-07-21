'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DollarSign, Calendar, Users, Percent, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const chartData = [
  { month: 'Jan', revenue: 1860.5 },
  { month: 'Fev', revenue: 3050.75 },
  { month: 'Mar', revenue: 2390.0 },
  { month: 'Abr', revenue: 4300.2 },
  { month: 'Mai', revenue: 2490.0 },
  { month: 'Jun', revenue: 4890.9 },
];

const chartConfig = {
  revenue: {
    label: 'Receita',
    color: 'hsl(var(--primary))',
  },
};

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
    navigator.clipboard.writeText(chatUrl).then(
      () => {
        toast({
          title: 'Sucesso!',
          description: 'Link do chatbot copiado para a área de transferência.',
        });
        setButtonText('Copiado!');
        setTimeout(() => setButtonText('Copiar Link do Chat'), 2000);
      },
      (err) => {
        toast({
          title: 'Erro!',
          description: 'Não foi possível copiar o link.',
          variant: 'destructive',
        });
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-headline tracking-wider text-foreground">
          Painel
        </h1>
        <Button
          onClick={copyToClipboard}
          disabled={!isClient}
          variant="outline"
          className="font-headline tracking-wider"
        >
          <Copy className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 18.981,35</div>
            <p className="text-xs text-muted-foreground">
              +20.1% do último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">
              Agendamentos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">
              +180.1% do último mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">
              Novos Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+42</div>
            <p className="text-xs text-muted-foreground">+19% do último mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">
              Taxa de Ocupação
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              +2% da última semana
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline tracking-wider">
            Visão Geral da Receita
          </CardTitle>
          <CardDescription>Receita dos últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  `R$${typeof value === 'number' ? value / 1000 : 0}k`
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
