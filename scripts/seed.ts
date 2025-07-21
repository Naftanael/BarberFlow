// scripts/seed.ts
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../src/lib/firestore';

const BARBERSHOP_ID = 'barbershop-1';

const services = [
  {
    name: 'Corte de Cabelo',
    price: 50.0,
    duration: 30, // em minutos
    isActive: true,
  },
  {
    name: 'Barba',
    price: 30.0,
    duration: 20,
    isActive: true,
  },
  {
    name: 'Corte e Barba',
    price: 70.0,
    duration: 50,
    isActive: true,
  },
  {
    name: 'Pintura de Cabelo',
    price: 100.0,
    duration: 60,
    isActive: true,
  },
  {
    name: 'Hidratação',
    price: 40.0,
    duration: 25,
    isActive: true,
  },
];

const barbers = [
  {
    barbershopId: BARBERSHOP_ID,
    name: 'João Silva',
    isActive: true,
    avatarUrl: 'https://placehold.co/128x128/3D2B1F/F5F5F5?text=JS',
  },
  {
    barbershopId: BARBERSHOP_ID,
    name: 'Carlos Pereira',
    isActive: true,
    avatarUrl: 'https://placehold.co/128x128/3D2B1F/F5F5F5?text=CP',
  },
  {
    barbershopId: BARBERSHOP_ID,
    name: 'Marcos Andrade',
    isActive: false,
    avatarUrl: 'https://placehold.co/128x128/3D2B1F/F5F5F5?text=MA',
  },
];

const clients = [
  {
    barbershopId: BARBERSHOP_ID,
    name: 'João da Silva',
    phone: '(11) 98765-4321',
    lastAppointment: new Date(2024, 4, 15).toISOString(),
  },
  {
    barbershopId: BARBERSHOP_ID,
    name: 'Maria Oliveira',
    phone: '(21) 91234-5678',
    lastAppointment: new Date(2024, 4, 18).toISOString(),
  },
  {
    barbershopId: BARBERSHOP_ID,
    name: 'Carlos Pereira',
    phone: '(31) 99999-8888',
    lastAppointment: new Date(2024, 2, 5).toISOString(),
  },
  {
    barbershopId: BARBERSHOP_ID,
    name: 'Ana Costa',
    phone: '(41) 98888-7777',
    lastAppointment: new Date(2024, 4, 20).toISOString(),
  },
  {
    barbershopId: BARBERSHOP_ID,
    name: 'Pedro Martins',
    phone: '(51) 97777-6666',
    lastAppointment: new Date(2024, 0, 10).toISOString(),
  },
];

async function seedDatabase() {
  console.log('Iniciando o processo de semeadura...');
  const barberShopRef = doc(db, 'barbershops', BARBERSHOP_ID);

  try {
    // 1. Criar a barbearia
    await setDoc(barberShopRef, {
      name: 'Barbearia do Zé',
      location: 'Rua Fictícia, 123',
    });
    console.log(`Barbearia com ID "${BARBERSHOP_ID}" criada/atualizada.`);

    // 2. Semear Serviços
    const servicesCollection = collection(db, 'barbershops', BARBERSHOP_ID, 'services');
    console.log('Adicionando serviços...');
    for (const service of services) {
      await addDoc(servicesCollection, service);
    }
    console.log(`${services.length} serviços adicionados.`);

    // 3. Semear Barbeiros
    const barbersCollection = collection(db, 'barbershops', BARBERSHOP_ID, 'barbers');
    console.log('Adicionando barbeiros...');
    for (const barber of barbers) {
      await addDoc(barbersCollection, barber);
    }
    console.log(`${barbers.length} barbeiros adicionados.`);

    // 4. Semear Clientes
    const clientsCollection = collection(db, 'barbershops', BARBERSHOP_ID, 'clients');
    console.log('Adicionando clientes...');
    for (const client of clients) {
      await addDoc(clientsCollection, client);
    }
    console.log(`${clients.length} clientes adicionados.`);

    console.log('Semeação do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('Ocorreu um erro durante a semeadura:', error);
  }
}

seedDatabase();
