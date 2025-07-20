'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const timeSlots = Array.from(
  { length: 13 },
  (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`
);

const mockAppointments = [
  {
    id: 1,
    time: '09:00',
    duration: 60,
    barber: 'João Silva',
    client: 'Ricardo',
    service: 'Corte e Barba',
    status: 'Agendado',
  },
  {
    id: 2,
    time: '10:00',
    duration: 30,
    barber: 'Carlos Pereira',
    client: 'Fernando',
    service: 'Corte',
    status: 'Agendado',
  },
  {
    id: 3,
    time: '11:30',
    duration: 30,
    barber: 'João Silva',
    client: 'Ana',
    service: 'Corte',
    status: 'Concluído',
  },
  {
    id: 4,
    time: '14:00',
    duration: 90,
    barber: 'Carlos Pereira',
    client: 'Mariana',
    service: 'Hidratação',
    status: 'Agendado',
  },
];

const barbers = ['João Silva', 'Carlos Pereira'];

export default function AgendaPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-headline tracking-wider text-foreground">
        Agenda
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline tracking-wider">Hoje</CardTitle>
          <CardDescription>Visualização da agenda do dia.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full min-h-[832px]">
            <div className="w-20 text-right pr-4 font-body">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="h-16 flex items-start justify-end pt-1"
                >
                  <span className="text-sm text-muted-foreground">{time}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 relative">
              {/* Grid Lines */}
              {timeSlots.map((time) => (
                <div
                  key={`grid-${time}`}
                  className="col-span-1 md:col-span-2 h-16 border-t border-dashed border-border"
                ></div>
              ))}
              <div className="absolute top-0 left-1/2 w-px h-full bg-border border-dashed hidden md:block"></div>

              {/* Headers */}
              {barbers.map((barber, index) => (
                <div
                  key={barber}
                  className="absolute w-full md:w-1/2 text-center py-2 font-headline tracking-wider text-lg"
                  style={{ left: `${index * 50}%` }}
                >
                  {barber}
                </div>
              ))}

              {/* Appointments */}
              <div className="absolute top-12 w-full h-full">
                {mockAppointments.map((apt) => {
                  const barberIndex = barbers.indexOf(apt.barber);
                  if (barberIndex === -1) return null;

                  const [hour, minute] = apt.time.split(':').map(Number);
                  const top = (((hour - 8) * 60 + minute) / 60) * 64; // 64px per hour (16 * 4)
                  const height = (apt.duration / 60) * 64;

                  return (
                    <div
                      key={apt.id}
                      className="absolute w-full md:w-[48%]"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `calc(${barberIndex * 50}% + 1%)`,
                      }}
                    >
                      <div
                        className={`relative flex flex-col p-2 rounded-lg h-full text-xs shadow-lg overflow-hidden ${apt.status === 'Concluído' ? 'bg-secondary/50 text-muted-foreground' : 'bg-primary/80 text-primary-foreground'}`}
                      >
                        {height < 48 ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold truncate pr-2">
                              {apt.client} - {apt.service}
                            </span>
                            <span className="flex-shrink-0">{apt.time}</span>
                          </div>
                        ) : (
                          <>
                            <p className="font-bold">{apt.client}</p>
                            <p>{apt.service}</p>
                            <p className="mt-auto text-end">{apt.time}</p>
                          </>
                        )}
                        {apt.status !== 'Concluído' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
