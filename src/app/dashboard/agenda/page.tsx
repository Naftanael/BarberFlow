'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ClientOnly } from '@/components/client-only';

// --- DADOS MOCADOS ---
const mockAppointments = [
  {
    id: 1,
    startTime: '09:00',
    duration: 60,
    barber: 'João Silva',
    client: 'Ricardo',
    service: 'Corte e Barba',
    status: 'Agendado',
  },
  {
    id: 2,
    startTime: '10:00',
    duration: 30,
    barber: 'Carlos Pereira',
    client: 'Fernando',
    service: 'Corte',
    status: 'Agendado',
  },
  {
    id: 3,
    startTime: '11:30',
    duration: 30,
    barber: 'João Silva',
    client: 'Ana',
    service: 'Corte',
    status: 'Concluído',
  },
  {
    id: 4,
    startTime: '14:00',
    duration: 90,
    barber: 'Carlos Pereira',
    client: 'Mariana',
    service: 'Hidratação',
    status: 'Agendado',
  },
  {
    id: 5,
    startTime: '15:00',
    duration: 45,
    barber: 'João Silva',
    client: 'Beatriz',
    service: 'Penteado',
    status: 'Agendado',
  },
];

const barbers = ['João Silva', 'Carlos Pereira'];
const timeSlots = Array.from(
  { length: 13 },
  (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`
); // 08:00 to 20:00

// --- FUNÇÕES AUXILIARES ---
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// --- COMPONENTE PRINCIPAL ---
export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Converte a duração em minutos para o número de slots de 15min que ela ocupa
  const durationToGridRows = (duration: number) => Math.ceil(duration / 15);

  // Converte a hora de início para a linha de início da grade (1 slot = 15min)
  const startTimeToGridRow = (startTime: string) => {
    const minutesFrom8AM = timeToMinutes(startTime) - timeToMinutes('08:00');
    return Math.floor(minutesFrom8AM / 15) + 2; // +2 porque a grade começa na linha 2
  };

  return (
    <ClientOnly>
      <div className="space-y-8">
        {/* Cabeçalho da Página */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-headline tracking-wider text-foreground">
              Agenda
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie os agendamentos do dia.
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal bg-transparent border-copper text-cream hover:bg-copper hover:text-wood-dark font-body"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, 'PPP', { locale: ptBR })
                ) : (
                  <span>Escolha uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Calendário */}
        <Card className="bg-[#212121] border-white/10">
          <CardContent className="p-4">
            <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_repeat(2,1fr)] gap-x-4">
              {/* Coluna de Horários */}
              <div className="row-start-2 text-right">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-24 flex items-start justify-end pt-1 pr-4"
                  >
                    <span className="text-sm font-body text-cream/50 -translate-y-2">
                      {time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Colunas dos Barbeiros */}
              {barbers.map((barber) => (
                <div key={barber} className="relative col-start-auto">
                  <div className="text-center py-2 font-headline tracking-wider text-lg text-copper sticky top-0 bg-[#212121] z-10">
                    {barber}
                  </div>

                  {/* Grade de fundo para cada barbeiro */}
                  <div
                    className="relative grid grid-cols-1"
                    style={{ gridTemplateRows: 'repeat(48, 1rem)' }}
                  >
                    {/* Linhas da grade (48 slots de 15min = 12 horas) */}
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-4 border-t border-dashed border-white/5"
                      ></div>
                    ))}

                    {/* Renderiza os agendamentos para o barbeiro atual */}
                    {mockAppointments
                      .filter((apt) => apt.barber === barber)
                      .map((apt) => (
                        <div
                          key={apt.id}
                          className="absolute w-full px-1"
                          style={{
                            gridRowStart: startTimeToGridRow(apt.startTime),
                            gridRowEnd: `span ${durationToGridRows(
                              apt.duration
                            )}`,
                          }}
                        >
                          <div
                            className={cn(
                              'relative flex flex-col p-2 rounded-md h-full text-xs shadow-lg overflow-hidden transition-colors',
                              apt.status === 'Concluído'
                                ? 'bg-zinc-600/50 text-cream/60'
                                : 'bg-wood-dark text-cream'
                            )}
                          >
                            <p className="font-bold font-body">{apt.client}</p>
                            <p className="text-cream/80">{apt.service}</p>
                            <p className="mt-auto text-end text-xs">
                              {apt.startTime}
                            </p>

                            {apt.status !== 'Concluído' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 text-cream hover:bg-white/10 hover:text-cream"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-wood-dark border-copper text-cream">
                                  <DropdownMenuItem className="focus:bg-copper focus:text-wood-dark">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    <span>Marcar como Concluído</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientOnly>
  );
}
