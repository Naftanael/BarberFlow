// src/app/dashboard/barbers/page.tsx
'use client';

import { useState } from 'react';
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
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Barber, BarberSchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const BARBERSHOP_ID = 'barbershop-1';

async function getBarbers(): Promise<Barber[]> {
  const barbersCol = collection(db, 'barbershops', BARBERSHOP_ID, 'barbers');
  const barbersSnapshot = await getDocs(barbersCol);
  const barbersList = barbersSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return BarberSchema.array().parse(barbersList);
}

export default async function BarbersPage() {
  const barbers = await getBarbers();

  return <BarbersView initialBarbers={barbers} />;
}

function BarbersView({ initialBarbers }: { initialBarbers: Barber[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [barbers, setBarbers] = useState(initialBarbers);
  const [newBarberName, setNewBarberName] = useState('');

  const handleSave = async () => {
    try {
      const newBarberData = {
        name: newBarberName,
        barbershopId: BARBERSHOP_ID,
        isActive: true,
      };

      const parsedBarber = BarberSchema.omit({ id: true }).parse(newBarberData);

      const docRef = await addDoc(
        collection(db, 'barbershops', BARBERSHOP_ID, 'barbers'),
        parsedBarber
      );

      setBarbers([...barbers, { ...parsedBarber, id: docRef.id }]);
      setNewBarberName('');
      toast({
        title: 'Sucesso!',
        description: 'Barbeiro salvo com sucesso.',
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar barbeiro:', error);
      toast({
        title: 'Erro!',
        description: 'Não foi possível salvar o barbeiro.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = () => {
    toast({
      title: 'Sucesso!',
      description: 'Informações do barbeiro atualizadas.',
    });
  };

  const handleDelete = () => {
    toast({
      title: 'Sucesso!',
      description: 'Barbeiro deletado com sucesso.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline tracking-wider text-foreground">
            Barbeiros
          </h1>
          <p className="text-muted-foreground">
            Gerencie os perfis dos barbeiros da sua equipe.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-headline tracking-wider">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Barbeiro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline tracking-wider">
                Adicionar Novo Barbeiro
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo barbeiro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="name"
                  className="text-right font-headline tracking-wide"
                >
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newBarberName}
                  onChange={(e) => setNewBarberName(e.target.value)}
                  placeholder="Nome do barbeiro"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="picture"
                  className="text-right font-headline tracking-wide"
                >
                  Foto
                </Label>
                <Input
                  id="picture"
                  type="file"
                  className="col-span-3 file:text-foreground file:font-headline file:tracking-wide file:border-primary file:bg-primary/20 hover:file:bg-primary/30"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="status"
                  className="text-right font-headline tracking-wide"
                >
                  Status
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch id="status" defaultChecked />
                  <Label htmlFor="status">Ativo</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="font-headline tracking-wider"
                onClick={handleSave}
              >
                Salvar Barbeiro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => (
          <Card
            key={barber.id}
            className="flex flex-col text-center hover:border-primary/50 transition-colors"
          >
            <CardHeader className="items-center">
              <Avatar className="h-32 w-32 border-4 border-primary/50">
                <AvatarImage asChild src={barber.avatarUrl || ''}>
                  <Image
                    src={barber.avatarUrl || 'https://placehold.co/128x128.png'}
                    alt={barber.name}
                    width={128}
                    height={128}
                    data-ai-hint={'professional barber'}
                  />
                </AvatarImage>
                <AvatarFallback>{barber.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <CardTitle className="font-headline tracking-wider text-2xl">
                {barber.name}
              </CardTitle>
              <Badge
                variant={barber.isActive ? 'default' : 'secondary'}
                className="mt-2"
              >
                {barber.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </CardContent>
            <div className="flex justify-center gap-2 p-4">
              <Button
                variant="outline"
                size="sm"
                className="font-headline tracking-wide w-full"
                onClick={handleEdit}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="font-headline tracking-wide w-full"
                onClick={handleDelete}
              >
                Deletar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
