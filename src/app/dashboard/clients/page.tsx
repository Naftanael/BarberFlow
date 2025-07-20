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

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Cadastro de Clientes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Novo Cliente</CardTitle>
          <CardDescription>Preencha os dados do novo cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Nome do cliente" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(99) 99999-9999" />
            </div>
            <Button className="w-fit" type="submit">
              Cadastrar Cliente
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientList />
        </CardContent>
      </Card>
    </div>
  );
}
