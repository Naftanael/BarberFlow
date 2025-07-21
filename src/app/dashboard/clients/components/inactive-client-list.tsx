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
import { format, subDays } from 'date-fns';
import { Client } from '@/lib/schemas';

interface InactiveClientListProps {
  clients: Client[];
}

export default function InactiveClientList({
  clients,
}: InactiveClientListProps) {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const inactiveClients = clients.filter(
    (client) => new Date(client.lastAppointment) < thirtyDaysAgo
  );

  if (inactiveClients.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum cliente inativo no momento.
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
        {inactiveClients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.name}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>
              {format(new Date(client.lastAppointment), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              <Badge variant={'outline'}>Inativo</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
