'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClientOnly } from '@/components/client-only';
import { getBarbers, updateBarberAvailability } from '@/lib/firestore';
import { Barber, AvailabilityData } from '@/lib/schemas';

const BARBERSHOP_ID = 'barbershop-1';

const daysOfWeek = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

const initialAvailability: AvailabilityData = {
  workDays: [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
  ],
  workHours: { start: '09:00', end: '18:00' },
  breaks: [{ start: '12:00', end: '13:00' }],
};

export default function AvailabilityPage() {
  const { toast } = useToast();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [availability, setAvailability] =
    useState<AvailabilityData>(initialAvailability);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBarbers = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedBarbers = await getBarbers(BARBERSHOP_ID);
      setBarbers(fetchedBarbers);
      if (fetchedBarbers.length > 0) {
        const firstBarber = fetchedBarbers[0];
        setSelectedBarberId(firstBarber.id!);
        setAvailability(firstBarber.availability || initialAvailability);
      }
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os barbeiros.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  const handleBarberChange = (barberId: string) => {
    const barber = barbers.find((b) => b.id === barberId);
    if (barber) {
      setSelectedBarberId(barber.id!);
      setAvailability(barber.availability || initialAvailability);
    }
  };

  const handleWorkDayChange = (day: string, checked: boolean) => {
    setAvailability((prev) => {
      const newWorkDays = checked
        ? [...prev.workDays, day]
        : prev.workDays.filter((d) => d !== day);
      return { ...prev, workDays: newWorkDays };
    });
  };

  const handleWorkHoursChange = (field: 'start' | 'end', value: string) => {
    setAvailability((prev) => ({
      ...prev,
      workHours: { ...prev.workHours, [field]: value },
    }));
  };

  const handleBreakChange = (
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setAvailability((prev) => {
      const newBreaks = [...prev.breaks];
      newBreaks[index] = { ...newBreaks[index], [field]: value };
      return { ...prev, breaks: newBreaks };
    });
  };

  const addBreak = () => {
    setAvailability((prev) => ({
      ...prev,
      breaks: [...prev.breaks, { start: '12:00', end: '13:00' }],
    }));
  };

  const removeBreak = (index: number) => {
    setAvailability((prev) => ({
      ...prev,
      breaks: prev.breaks.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!selectedBarberId) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione um barbeiro.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      await updateBarberAvailability(
        BARBERSHOP_ID,
        selectedBarberId,
        availability
      );
      toast({
        title: 'Sucesso!',
        description: 'Disponibilidade salva com sucesso.',
      });
      setBarbers(
        barbers.map((b) =>
          b.id === selectedBarberId ? { ...b, availability } : b
        )
      );
    } catch (error) {
      console.error('Erro ao salvar disponibilidade:', error);
      toast({
        title: 'Erro!',
        description: 'Não foi possível salvar a disponibilidade.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-headline tracking-wider text-foreground">
          Disponibilidade
        </h1>
        <p className="text-muted-foreground">
          Defina os dias e horários de trabalho para cada barbeiro.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="w-full md:w-1/2">
            <Label
              htmlFor="barber-select"
              className="font-headline tracking-wide text-lg"
            >
              Barbeiro
            </Label>
            <ClientOnly>
              <Select
                value={selectedBarberId}
                onValueChange={handleBarberChange}
              >
                <SelectTrigger id="barber-select">
                  <SelectValue placeholder="Selecione um barbeiro" />
                </SelectTrigger>
                <SelectContent>
                  {barbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id!}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ClientOnly>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && !selectedBarberId ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-headline tracking-wide text-lg">
                  Dias de Trabalho
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.toLowerCase()}
                        checked={availability.workDays.includes(day)}
                        onCheckedChange={(checked) =>
                          handleWorkDayChange(day, !!checked)
                        }
                      />
                      <Label htmlFor={day.toLowerCase()} className="font-body">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-headline tracking-wide text-lg">
                  Horário de Trabalho Padrão
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-full">
                    <Label htmlFor="start-time" className="font-body">
                      Início
                    </Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={availability.workHours.start}
                      onChange={(e) =>
                        handleWorkHoursChange('start', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-full">
                    <Label htmlFor="end-time" className="font-body">
                      Fim
                    </Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={availability.workHours.end}
                      onChange={(e) =>
                        handleWorkHoursChange('end', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <ClientOnly>
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline tracking-wide text-lg">
                      Intervalos
                    </h3>
                    <Button variant="outline" size="sm" onClick={addBreak}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {availability.breaks.map((breakItem, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-full">
                          <Label
                            htmlFor={`break-start-${index}`}
                            className="font-body"
                          >
                            Início
                          </Label>
                          <Input
                            id={`break-start-${index}`}
                            type="time"
                            value={breakItem.start}
                            onChange={(e) =>
                              handleBreakChange(index, 'start', e.target.value)
                            }
                          />
                        </div>
                        <div className="w-full">
                          <Label
                            htmlFor={`break-end-${index}`}
                            className="font-body"
                          >
                            Fim
                          </Label>
                          <Input
                            id={`break-end-${index}`}
                            type="time"
                            value={breakItem.end}
                            onChange={(e) =>
                              handleBreakChange(index, 'end', e.target.value)
                            }
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="self-end text-destructive hover:bg-destructive/10"
                          onClick={() => removeBreak(index)}
                        >
                          <span className="sr-only">Remover</span>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </ClientOnly>

              <div className="flex justify-end">
                <Button
                  className="font-headline tracking-wider text-lg"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Salvar Alterações
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
