'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getServices } from '@/lib/firestore';
import { Service } from '@/lib/schemas';

const BARBERSHOP_ID = 'barbershop-1';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      const fetchedServices = await getServices(BARBERSHOP_ID);
      setServices(fetchedServices);
    };

    fetchServices();
  }, []);

  const handleSave = () => {
    // Lógica para salvar o novo serviço no Firestore
    toast({
      title: 'Sucesso!',
      description: 'Serviço salvo com sucesso.',
    });
    setIsDialogOpen(false);
  };

  const handleEdit = () => {
    // Lógica para editar o serviço
    toast({
      title: 'Sucesso!',
      description: 'Serviço atualizado com sucesso.',
    });
  };

  const handleDelete = () => {
    // Lógica para deletar o serviço
    toast({
      title: 'Sucesso!',
      description: 'Serviço deletado com sucesso.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline tracking-wider text-foreground">
            Serviços
          </h1>
          <p className="text-muted-foreground">
            Gerencie os serviços oferecidos pela barbearia.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-headline tracking-wider">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline tracking-wider">
                Adicionar Novo Serviço
              </DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo serviço.
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
                  defaultValue="Corte Infantil"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="duration"
                  className="text-right font-headline tracking-wide"
                >
                  Duração (min)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  defaultValue="25"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="price"
                  className="text-right font-headline tracking-wide"
                >
                  Preço (R$)
                </Label>
                <Input
                  id="price"
                  type="number"
                  defaultValue="40.00"
                  className="col-span-3"
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
                Salvar serviço
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-headline tracking-wide">
                  Serviço
                </TableHead>
                <TableHead className="font-headline tracking-wide">
                  Duração
                </TableHead>
                <TableHead className="font-headline tracking-wide">
                  Preço
                </TableHead>
                <TableHead className="font-headline tracking-wide">
                  Status
                </TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.duration} min</TableCell>
                  <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={service.isActive ? 'default' : 'secondary'}>
                      {service.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={handleEdit}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={handleDelete}
                        >
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
