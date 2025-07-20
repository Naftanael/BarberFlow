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

const allClients = [
  {
    name: 'João da Silva',
    phone: '(11) 98765-4321',
    status: 'active',
    lastAppointment: new Date(2024, 4, 15), // Maio
  },
  {
    name: 'Maria Oliveira',
    phone: '(21) 91234-5678',
    status: 'active',
    lastAppointment: new Date(2024, 4, 18), // Maio
  },
  {
    name: 'Carlos Pereira',
    phone: '(31) 99999-8888',
    status: 'inactive',
    lastAppointment: new Date(2024, 2, 5), // Março
  },
  {
    name: 'Ana Costa',
    phone: '(41) 98888-7777',
    status: 'active',
    lastAppointment: new Date(2024, 4, 20), // Maio
  },
  {
    name: 'Pedro Martins',
    phone: '(51) 97777-6666',
    status: 'inactive',
    lastAppointment: new Date(2024, 0, 10), // Janeiro
  },
];

export default function InactiveClientList() {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const inactiveClients = allClients.filter(
    (client) => client.lastAppointment < thirtyDaysAgo
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
          <TableRow key={client.phone}>
            <TableCell>{client.name}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>
              {format(client.lastAppointment, 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              <Badge
                variant={client.status === 'active' ? 'default' : 'outline'}
              >
                {client.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
