// scripts/seed.ts
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firestore.js'; // Ajuste o caminho conforme necessário
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
    const servicesCollection = collection(db, 'services');
    console.log('Adicionando serviços ao Firestore...');
    for (const service of services) {
        try {
            const docRef = await addDoc(servicesCollection, service);
            console.log(`Serviço "${service.name}" adicionado com ID: ${docRef.id}`);
        }
        catch (error) {
            console.error(`Erro ao adicionar o serviço "${service.name}":`, error);
        }
    }
    console.log('Semeação de serviços concluída.');
}
seedServices();
