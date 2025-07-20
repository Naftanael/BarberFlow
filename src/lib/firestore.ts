// src/lib/firestore.ts
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { ServiceSchema, Service } from './schemas';
import { z } from 'zod';

// Configuração do Firebase (deve ser movida para variáveis de ambiente)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, '127.0.0.1', 8081);
}

// Funções de exemplo para interagir com o Firestore

/**
 * Busca todos os serviços de um determinado salão.
 * @param barberShopId O ID do salão de beleza.
 * @returns Uma lista de serviços.
 */
export async function getServices(
  barberShopId: string,
): Promise<Service[]> {
  const servicesCol = collection(db, 'barbershops', barberShopId, 'services');
  const servicesSnapshot = await getDocs(servicesCol);
  const servicesList = servicesSnapshot.docs.map((doc) => doc.data());

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
  serviceName: string,
): Promise<Service | null> {
  const servicesCol = collection(db, 'barbershops', barberShopId, 'services');
  const q = query(servicesCol, where('name', '==', serviceName));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const serviceData = querySnapshot.docs[0].data();
  return ServiceSchema.parse(serviceData);
}

export { db };
