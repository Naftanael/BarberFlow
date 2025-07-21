'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClientList from './components/client-list';
import InactiveClientList from './components/inactive-client-list';
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getClients } from '@/lib/firestore';
import { Client } from '@/lib/schemas';

const BARBERSHOP_ID = 'barbershop-1';

export default function ClientsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await getClients(BARBERSHOP_ID);
      setClients(fetchedClients);
    };
    fetchClients();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-headline tracking-wider text-foreground">
          Clientes
        </h1>
        <p className="text-muted-foreground">
          Gerencie os clientes da sua barbearia.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline tracking-wider">
              Clientes a Reengajar
            </CardTitle>
            <CardDescription>
              Clientes que não agendam um serviço há mais de 30 dias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InactiveClientList clients={clients} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline tracking-wider">
                Novo Cliente
              </CardTitle>
              <CardDescription>
                Preencha os dados do novo cliente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="name"
                    className="font-headline tracking-wider"
                  >
                    Nome
                  </Label>
                  <Input id="name" placeholder="Nome do cliente" />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="phone"
                    className="font-headline tracking-wider"
                  >
                    Telefone
                  </Label>
                  <Input id="phone" placeholder="(99) 99999-9999" />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="lastAppointment"
                    className="font-headline tracking-wider"
                  >
                    Data do Último Atendimento
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, 'PPP', { locale: ptBR })
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  className="w-fit font-headline tracking-wider"
                  type="submit"
                >
                  Cadastrar Cliente
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline tracking-wider">
                Lista de Clientes Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ClientList clients={clients} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
