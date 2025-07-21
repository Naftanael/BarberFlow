// src/app/dashboard/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Service } from '@/lib/schemas';
import { getServices, addService, updateService, deleteService } from '@/lib/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

const BARBERSHOP_ID = 'barbershop-1';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const fetchedServices = await getServices(BARBERSHOP_ID);
        setServices(fetchedServices);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar os serviços.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [toast]);

  const handleOpenDialog = (service?: Service) => {
    setCurrentService(service || { name: '', duration: 30, price: 0, isActive: true });
    setIsDialogOpen(true);
  };

  const handleSaveService = async () => {
    try {
      if (currentService.id) {
        // Atualizar
        const { id, ...dataToUpdate } = currentService;
        await updateService(BARBERSHOP_ID, id, dataToUpdate);
        setServices(services.map(s => s.id === id ? { ...s, ...dataToUpdate } : s));
        toast({ title: "Sucesso!", description: "Serviço atualizado com sucesso." });
      } else {
        // Criar
        const newServiceId = await addService(BARBERSHOP_ID, currentService as Omit<Service, 'id'>);
        setServices([...services, { ...currentService, id: newServiceId } as Service]);
        toast({ title: "Sucesso!", description: "Serviço adicionado com sucesso." });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar o serviço.", variant: "destructive" });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(BARBERSHOP_ID, serviceId);
      setServices(services.filter(s => s.id !== serviceId));
      toast({ title: "Sucesso!", description: "Serviço deletado com sucesso." });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível deletar o serviço.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline tracking-wider text-foreground">
            Serviços
          </h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pela sua barbearia.
          </p>
        </div>
        <Button className="font-headline tracking-wider" onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Serviço
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline tracking-wider">Lista de Serviços</CardTitle>
          <CardDescription>Visualize e edite os serviços disponíveis.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Duração (min)</TableHead>
                  <TableHead>Preço (R$)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Ações</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.duration}</TableCell>
                    <TableCell>{service.price.toFixed(2)}</TableCell>
                    <TableCell>{service.isActive ? 'Ativo' : 'Inativo'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenDialog(service)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteService(service.id!)}>Deletar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline tracking-wider">{currentService.id ? 'Editar Serviço' : 'Adicionar Serviço'}</DialogTitle>
            <DialogDescription>Preencha os detalhes do serviço abaixo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input id="name" value={currentService.name || ''} onChange={(e) => setCurrentService({...currentService, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input id="duration" type="number" value={currentService.duration || ''} onChange={(e) => setCurrentService({...currentService, duration: parseInt(e.target.value, 10) })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" type="number" value={currentService.price || ''} onChange={(e) => setCurrentService({...currentService, price: parseFloat(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveService}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
