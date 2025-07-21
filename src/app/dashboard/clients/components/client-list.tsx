'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Client } from '@/lib/schemas';
import { subDays } from 'date-fns';

interface ClientListProps {
  clients: Client[];
}

export default function ClientList({ clients }: ClientListProps) {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const activeClients = clients.filter(
    (client) => client.lastAppointment >= thirtyDaysAgo
  );

  if (activeClients.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum cliente ativo encontrado.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Último Atendimento</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activeClients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.name}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>
              {format(new Date(client.lastAppointment), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  new Date(client.lastAppointment) >= thirtyDaysAgo
                    ? 'default'
                    : 'outline'
                }
              >
                {new Date(client.lastAppointment) >= thirtyDaysAgo
                  ? 'Ativo'
                  : 'Inativo'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
