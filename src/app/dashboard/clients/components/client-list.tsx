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

const clients = [
  {
    name: 'João da Silva',
    phone: '(11) 98765-4321',
    status: 'active',
  },
  {
    name: 'Maria Oliveira',
    phone: '(21) 91234-5678',
    status: 'active',
  },
  {
    name: 'Carlos Pereira',
    phone: '(31) 99999-8888',
    status: 'inactive',
  },
  {
    name: 'Ana Costa',
    phone: '(41) 98888-7777',
    status: 'active',
  },
];

export default function ClientList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.phone}>
            <TableCell>{client.name}</TableCell>
            <TableCell>{client.phone}</TableCell>
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
