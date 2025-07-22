// src/app/dashboard/barbers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Barber } from '@/lib/schemas';
import { getBarbers, addBarber, updateBarber, deleteBarber } from '@/lib/firestore';

const BARBERSHOP_ID = 'barbershop-1';

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBarber, setCurrentBarber] = useState<Partial<Barber>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchBarbers = async () => {
      setIsLoading(true);
      try {
        const fetchedBarbers = await getBarbers(BARBERSHOP_ID);
        setBarbers(fetchedBarbers);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar os barbeiros.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBarbers();
  }, [toast]);

  const handleOpenDialog = (barber?: Barber) => {
    setCurrentBarber(barber || { name: '', isActive: true });
    setIsDialogOpen(true);
  };

  const handleSaveBarber = async () => {
    try {
      const barberData = {
        name: currentBarber.name || '',
        isActive: currentBarber.isActive ?? true,
        barbershopId: BARBERSHOP_ID,
        // Adicione outros campos conforme necessário
      };

      if (currentBarber.id) {
        // Atualizar
        await updateBarber(BARBERSHOP_ID, currentBarber.id, barberData);
        setBarbers(barbers.map(b => b.id === currentBarber.id ? { ...b, ...barberData } : b));
        toast({ title: "Sucesso!", description: "Barbeiro atualizado com sucesso." });
      } else {
        // Criar
        const newBarberId = await addBarber(BARBERSHOP_ID, barberData as Omit<Barber, 'id'>);
        setBarbers([...barbers, { ...barberData, id: newBarberId }]);
        toast({ title: "Sucesso!", description: "Barbeiro adicionado com sucesso." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar o barbeiro.", variant: "destructive" });
    }
  };

  const handleDeleteBarber = async (barberId: string) => {
    try {
      await deleteBarber(BARBERSHOP_ID, barberId);
      setBarbers(barbers.filter(b => b.id !== barberId));
      toast({ title: "Sucesso!", description: "Barbeiro deletado com sucesso." });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível deletar o barbeiro.", variant: "destructive" });
    }
  };
  
  const handleStatusChange = async (barberId: string, isActive: boolean) => {
    try {
      await updateBarber(BARBERSHOP_ID, barberId, { isActive });
      setBarbers(barbers.map(b => b.id === barberId ? { ...b, isActive } : b));
      toast({ title: "Sucesso!", description: "Status do barbeiro atualizado." });
    } catch (error) {
       toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline tracking-wider text-foreground">Barbeiros</h1>
          <p className="text-muted-foreground">Gerencie os perfis dos barbeiros da sua equipe.</p>
        </div>
        <Button className="font-headline tracking-wider" onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Barbeiro
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <Card key={barber.id} className="flex flex-col text-center hover:border-primary/50 transition-colors">
              <CardHeader className="items-center">
                <Avatar className="h-32 w-32 border-4 border-primary/50">
                  <AvatarImage asChild src={barber.avatarUrl || ''}>
                    <Image src={barber.avatarUrl || 'https://placehold.co/128x128.png'} alt={barber.name} width={128} height={128} />
                  </AvatarImage>
                  <AvatarFallback>{barber.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center">
                <CardTitle className="font-headline tracking-wider text-2xl">{barber.name}</CardTitle>
                <Badge variant={barber.isActive ? 'default' : 'secondary'} className="mt-2">
                  {barber.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </CardContent>
              <div className="flex justify-center gap-2 p-4">
                <Button variant="outline" size="sm" className="font-headline tracking-wide w-full" onClick={() => handleOpenDialog(barber)}>Editar</Button>
                <Button variant="destructive" size="sm" className="font-headline tracking-wide w-full" onClick={() => handleDeleteBarber(barber.id!)}>Deletar</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline tracking-wider">{currentBarber.id ? 'Editar Barbeiro' : 'Adicionar Barbeiro'}</DialogTitle>
            <DialogDescription>Preencha os detalhes do barbeiro.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-headline tracking-wide">Nome</Label>
              <Input id="name" value={currentBarber.name || ''} onChange={(e) => setCurrentBarber({ ...currentBarber, name: e.target.value })} placeholder="Nome do barbeiro" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="picture" className="text-right font-headline tracking-wide">Foto</Label>
              <Input id="picture" type="file" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right font-headline tracking-wide">Status</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch id="status" checked={currentBarber.isActive} onCheckedChange={(checked) => setCurrentBarber({ ...currentBarber, isActive: checked })} />
                <Label htmlFor="status">{currentBarber.isActive ? 'Ativo' : 'Inativo'}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="font-headline tracking-wider" onClick={handleSaveBarber}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
