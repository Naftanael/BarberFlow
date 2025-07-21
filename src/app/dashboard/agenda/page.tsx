'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, CheckCircle2, MoreVertical, Loader2 } from 'lucide-react';
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
import { getBarbers, getAppointmentsByDate, getServices } from '@/lib/firestore';
import { Barber, Appointment, Service } from '@/lib/schemas';
import { useToast } from '@/hooks/use-toast';
import { ClientOnly } from '@/components/client-only';

const BARBERSHOP_ID = 'barbershop-1';

const timeSlots = Array.from(
  { length: 13 },
  (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`
); // 08:00 to 20:00

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedBarbers, fetchedAppointments, fetchedServices] = await Promise.all([
          getBarbers(BARBERSHOP_ID),
          getAppointmentsByDate(BARBERSHOP_ID, selectedDate),
          getServices(BARBERSHOP_ID),
        ]);
        setBarbers(fetchedBarbers.filter(b => b.isActive));
        setAppointments(fetchedAppointments);
        setServices(fetchedServices);
      } catch (error) {
        console.error("Erro ao buscar dados da agenda:", error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados da agenda.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedDate, toast]);

  const servicesMap = useMemo(() => {
    return services.reduce((acc, service) => {
      acc[service.id!] = service.name;
      return acc;
    }, {} as Record<string, string>);
  }, [services]);

  const durationToGridRows = (durationMinutes: number) => Math.ceil(durationMinutes / 15);

  const startTimeToGridRow = (startTime: Date) => {
    const minutesFrom8AM = (startTime.getHours() * 60 + startTime.getMinutes()) - timeToMinutes('08:00');
    return Math.floor(minutesFrom8AM / 15) + 2; // +2 porque a grade começa na linha 2
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline tracking-wider text-foreground">
            Agenda
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os agendamentos do dia.
          </p>
        </div>
        <ClientOnly>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[280px] justify-start text-left font-normal bg-transparent border-primary text-foreground hover:bg-primary hover:text-primary-foreground font-body"
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
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </ClientOnly>
      </div>

      <Card className="bg-card">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_repeat(var(--num-barbers,1),1fr)] gap-x-4" style={{ '--num-barbers': barbers.length } as React.CSSProperties}>
              <div className="row-start-2 text-right">
                {timeSlots.map((time) => (
                  <div key={time} className="h-24 flex items-start justify-end pt-1 pr-4">
                    <span className="text-sm font-body text-muted-foreground -translate-y-2">
                      {time}
                    </span>
                  </div>
                ))}
              </div>

              {barbers.map((barber) => (
                <div key={barber.id} className="relative col-start-auto">
                  <div className="text-center py-2 font-headline tracking-wider text-lg text-primary sticky top-0 bg-card z-10">
                    {barber.name}
                  </div>
                  <div className="relative grid grid-cols-1" style={{ gridTemplateRows: 'repeat(48, 1rem)' }}>
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="h-4 border-t border-dashed border-border"></div>
                    ))}
                    {appointments
                      .filter((apt) => apt.barberId === barber.id)
                      .map((apt) => {
                        const duration = (apt.endTime.getTime() - apt.startTime.getTime()) / 60000;
                        return (
                          <div
                            key={apt.id}
                            className="absolute w-full px-1"
                            style={{
                              gridRowStart: startTimeToGridRow(apt.startTime),
                              gridRowEnd: `span ${durationToGridRows(duration)}`,
                            }}
                          >
                            <div
                              className={cn(
                                'relative flex flex-col p-2 rounded-md h-full text-xs shadow-lg overflow-hidden transition-colors',
                                apt.status === 'concluído'
                                  ? 'bg-secondary text-secondary-foreground'
                                  : 'bg-primary/80 text-primary-foreground'
                              )}
                            >
                              <p className="font-bold font-body">{apt.clientName}</p>
                              <p className="text-primary-foreground/80">{servicesMap[apt.serviceId] || 'Serviço'}</p>
                              <p className="mt-auto text-end text-xs">
                                {format(apt.startTime, 'HH:mm')}
                              </p>
                              {apt.status !== 'concluído' && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute top-1 right-1 h-6 w-6 text-primary-foreground hover:bg-white/10"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      <span>Marcar como Concluído</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
