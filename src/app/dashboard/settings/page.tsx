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
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const mockUsers = [{ email: 'admin@barberflow.com', role: 'Administrador' }];

export default function SettingsPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSettingsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Sucesso!',
      description: 'As configurações da barbearia foram salvas.',
    });
  };

  const handleInviteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    toast({
      title: 'Convite Enviado!',
      description: `Um e-mail de convite foi enviado para ${email}.`,
    });
    setIsDialogOpen(false); // Fecha o dialog após o envio
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-headline tracking-wider text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as informações e os acessos da sua barbearia.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline tracking-wider">
            Informações da Barbearia
          </CardTitle>
          <CardDescription>
            Atualize o nome e o endereço que serão exibidos aos seus clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-headline tracking-wide">
                Nome da Barbearia
              </Label>
              <Input id="name" defaultValue="BarberFlow" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="font-headline tracking-wide">
                Endereço
              </Label>
              <Input
                id="address"
                defaultValue="Rua das Tesouras, 123, Centro"
              />
            </div>
            <Button
              className="w-fit font-headline tracking-wider"
              type="submit"
            >
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline tracking-wider">
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Convide e gerencie os usuários que podem acessar o painel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.email}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="font-headline tracking-wider"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Convidar Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline tracking-wider">
                  Convidar Usuário
                </DialogTitle>
                <DialogDescription>
                  O usuário receberá um e-mail com instruções para criar sua
                  senha e acessar o painel.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email do Usuário</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="font-headline tracking-wider"
                  >
                    Enviar Convite
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
