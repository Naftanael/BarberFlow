// scripts/seed.ts
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../src/lib/firestore';

const services = [
  {
    name: 'Corte de Cabelo',
    price: 50.0,
    duration: 30, // em minutos
  },
  {
    name: 'Barba',
    price: 30.0,
    duration: 20,
  },
  {
    name: 'Corte e Barba',
    price: 70.0,
    duration: 50,
  },
  {
    name: 'Pintura de Cabelo',
    price: 100.0,
    duration: 60,
  },
  {
    name: 'Hidratação',
    price: 40.0,
    duration: 25,
  },
];

async function seedServices() {
  const barberShopId = 'barbershop-1';
  const barberShopRef = doc(db, 'barbershops', barberShopId);

  try {
    // Create the barbershop document
    await setDoc(barberShopRef, { name: 'Barbearia do Zé', location: 'Rua Fictícia, 123' });
    console.log(`Barbearia com ID "${barberShopId}" criada.`);

    const servicesCollection = collection(db, 'barbershops', barberShopId, 'services');
    console.log('Adicionando serviços ao Firestore...');

    for (const service of services) {
      try {
        const docRef = await addDoc(servicesCollection, service);
        console.log(`Serviço "${service.name}" adicionado com ID: ${docRef.id}`);
      } catch (error) {
        console.error(`Erro ao adicionar o serviço "${service.name}":`, error);
      }
    }

    console.log('Semeação de serviços concluída.');
  } catch (error) {
    console.error(`Erro ao criar a barbearia "${barberShopId}":`, error);
  }
}

seedServices();
