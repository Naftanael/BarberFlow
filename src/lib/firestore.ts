// src/lib/firestore.ts
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
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

/**
 * Busca todos os serviços ativos de uma barbearia específica.
 * @param barbershopId - O ID da barbearia.
 * @returns Uma promessa que resolve para um array de serviços.
 */
export async function getActiveServices(
  barbershopId: string
): Promise<Service[]> {
  if (!barbershopId) {
    throw new Error('O ID da barbearia é obrigatório.');
  }

  const servicesRef = collection(db, 'services');
  const q = query(
    servicesRef,
    where('barbershopId', '==', barbershopId),
    where('isActive', '==', true)
  );

  const querySnapshot = await getDocs(q);

  const services = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Valida os dados do Firestore com nosso schema Zod
  return z.array(ServiceSchema).parse(services);
}
