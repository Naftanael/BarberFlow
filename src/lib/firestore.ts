// src/lib/firestore.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase'; // Importa a instância do DB já inicializada
import {
  ServiceSchema,
  Service,
  BarberSchema,
  Barber,
  Client,
  ClientSchema,
} from './schemas';
import { z } from 'zod';

const BARBERSHOP_ID = 'barbershop-1';

// As funções agora usam a instância 'db' importada
/**
 * Busca todos os serviços de um determinado salão.
 * @param barberShopId O ID do salão de beleza.
 * @returns Uma lista de serviços.
 */
export async function getServices(barberShopId: string): Promise<Service[]> {
  const servicesCol = collection(db, 'barbershops', barberShopId, 'services');
  const servicesSnapshot = await getDocs(servicesCol);
  const servicesList = servicesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Valida os dados com Zod
  return z.array(ServiceSchema).parse(servicesList);
}

/**
 * Busca um serviço específico pelo nome.
 * @param barberShopId O ID do salão de beleza.
 * @param serviceName O nome do serviço.
 * @returns O serviço encontrado ou null.
 */
export async function getServiceByName(
  barberShopId: string,
  serviceName: string
): Promise<Service | null> {
  const servicesCol = collection(db, 'barbershops', barberShopId, 'services');
  const q = query(servicesCol, where('name', '==', serviceName));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const serviceData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  return ServiceSchema.parse(serviceData);
}

/**
 * Busca todos os barbeiros de um determinado salão.
 * @param barberShopId O ID do salão de beleza.
 * @returns Uma lista de barbeiros.
 */
export async function getBarbers(barberShopId: string): Promise<Barber[]> {
  const barbersCol = collection(db, 'barbershops', barberShopId, 'barbers');
  const barbersSnapshot = await getDocs(barbersCol);
  const barbersList = barbersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return z.array(BarberSchema).parse(barbersList);
}

/**
 * Busca todos os clientes de um determinado salão.
 * @param barberShopId O ID do salão de beleza.
 * @returns Uma lista de clientes.
 */
export async function getClients(barberShopId: string): Promise<Client[]> {
  const clientsCol = collection(db, 'barbershops', barberShopId, 'clients');
  const clientsSnapshot = await getDocs(clientsCol);
  const clientsList = clientsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return z.array(ClientSchema).parse(clientsList);
}

export { db };
