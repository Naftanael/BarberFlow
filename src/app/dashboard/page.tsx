// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Share2, Users, Scissors, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ClientOnly } from '@/components/client-only';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { day: 'Segunda', faturamento: 400 },
  { day: 'Terça', faturamento: 300 },
  { day: 'Quarta', faturamento: 600 },
  { day: 'Quinta', faturamento: 800 },
  { day: 'Sexta', faturamento: 700 },
  { day: 'Sábado', faturamento: 900 },
];

const chartConfig = {
  faturamento: {
    label: 'Faturamento',
    color: 'hsl(var(--primary))',
  },
};

export default function Dashboard() {
  const { toast } = useToast();
  const [buttonText, setButtonText] = useState('Copiar Link do Chat');

  const copyToClipboard = () => {
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
    <ClientOnly>
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
            <CardTitle className="font-headline tracking-wider">
              Faturamento da Semana
            </CardTitle>
            <CardDescription>
              Desempenho do faturamento nos últimos 6 dias úteis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="faturamento"
                  fill="var(--color-faturamento)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </ClientOnly>
  );
}
