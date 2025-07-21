// src/lib/firestore.ts
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  Timestamp,
  addDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase'; // Importa a instância do DB já inicializada
import {
  ServiceSchema,
  Service,
  BarberSchema,
  Barber,
  Client,
  ClientSchema,
  AvailabilitySchema,
  AvailabilityData,
  Appointment,
  AppointmentSchema,
} from './schemas';
import { z } from 'zod';

const BARBERSHOP_ID = 'barbershop-1';

// --- FUNÇÕES DE SERVIÇO ---
export async function getServices(barberShopId: string): Promise<Service[]> {
  const servicesCol = collection(db, 'barbershops', barberShopId, 'services');
  const servicesSnapshot = await getDocs(servicesCol);
  const servicesList = servicesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return z.array(ServiceSchema).parse(servicesList);
}

// --- FUNÇÕES DE BARBEIRO ---
export async function getBarbers(barberShopId: string): Promise<Barber[]> {
  const barbersCol = collection(db, 'barbershops', barberShopId, 'barbers');
  const barbersSnapshot = await getDocs(barbersCol);
  const barbersList = barbersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return z.array(BarberSchema).parse(barbersList);
}

export async function updateBarberAvailability(
  barberShopId: string,
  barberId: string,
  availability: AvailabilityData
) {
  const barberRef = doc(db, 'barbershops', barberShopId, 'barbers', barberId);
  const validatedAvailability = AvailabilitySchema.parse(availability);
  await updateDoc(barberRef, {
    availability: validatedAvailability,
  });
}

// --- FUNÇÕES DE CLIENTE ---
export async function getClients(barberShopId: string): Promise<Client[]> {
  const clientsCol = collection(db, 'barbershops', barberShopId, 'clients');
  const clientsSnapshot = await getDocs(clientsCol);
  const clientsList = clientsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return z.array(ClientSchema).parse(clientsList);
}

// --- LÓGICA DE AGENDAMENTO ---

/**
 * Converte uma string de hora (HH:mm) para minutos desde o início do dia.
 */
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Verifica os horários disponíveis para um serviço em uma data específica.
 * @param barberShopId O ID da barbearia.
 * @param serviceId O ID do serviço.
 * @param date A data para verificar a disponibilidade.
 * @returns Uma lista de horários disponíveis.
 */
export async function checkAvailability(
  barberShopId: string,
  serviceId: string,
  date: Date
): Promise<string[]> {
  const serviceRef = doc(
    db,
    'barbershops',
    barberShopId,
    'services',
    serviceId
  );
  const serviceSnap = await getDoc(serviceRef);
  if (!serviceSnap.exists()) {
    throw new Error('Serviço não encontrado');
  }
  const service = ServiceSchema.parse({
    id: serviceSnap.id,
    ...serviceSnap.data(),
  });
  const serviceDuration = service.duration;

  const barbers = await getBarbers(barberShopId);
  const activeBarbers = barbers.filter((b) => b.isActive && b.availability);

  // Busca todos os agendamentos para a data selecionada
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointmentsCol = collection(
    db,
    'barbershops',
    barberShopId,
    'appointments'
  );
  const q = query(
    appointmentsCol,
    where('startTime', '>=', Timestamp.fromDate(startOfDay)),
    where('startTime', '<=', Timestamp.fromDate(endOfDay))
  );
  const appointmentsSnapshot = await getDocs(q);
  const existingAppointments = appointmentsSnapshot.docs.map((doc) =>
    AppointmentSchema.parse({ id: doc.id, ...doc.data() })
  );

  const availableSlots: Set<string> = new Set();
  const dayOfWeek = date.toLocaleString('pt-BR', { weekday: 'long' });

  for (const barber of activeBarbers) {
    if (
      !barber
        .availability!.workDays.map((d) => d.toLowerCase())
        .includes(dayOfWeek.toLowerCase())
    ) {
      continue;
    }

    const workStart = timeToMinutes(barber.availability!.workHours.start);
    const workEnd = timeToMinutes(barber.availability!.workHours.end);

    // Gera slots de 15 em 15 minutos
    for (let t = workStart; t < workEnd; t += 15) {
      const slotStart = t;
      const slotEnd = t + serviceDuration;

      // Verifica se o slot termina depois do expediente
      if (slotEnd > workEnd) continue;

      // Verifica se o slot está dentro de um intervalo
      const isInBreak = barber.availability!.breaks.some(
        (b) =>
          slotStart < timeToMinutes(b.end) && slotEnd > timeToMinutes(b.start)
      );
      if (isInBreak) continue;

      // Verifica se o slot conflita com agendamentos existentes para este barbeiro
      const isBooked = existingAppointments.some(
        (apt) =>
          apt.barberId === barber.id &&
          slotStart < apt.endTime.getHours() * 60 + apt.endTime.getMinutes() &&
          slotEnd > apt.startTime.getHours() * 60 + apt.startTime.getMinutes()
      );
      if (isBooked) continue;

      // Se o slot estiver livre, adiciona à lista
      const hour = Math.floor(slotStart / 60)
        .toString()
        .padStart(2, '0');
      const minute = (slotStart % 60).toString().padStart(2, '0');
      availableSlots.add(`${hour}:${minute}`);
    }
  }

  return Array.from(availableSlots).sort();
}

/**
 * Cria um novo agendamento.
 * @param appointmentData Os dados do agendamento.
 * @returns O ID do novo agendamento.
 */
export async function scheduleAppointment(
  appointmentData: Omit<Appointment, 'id' | 'status'>
): Promise<string> {
  const validatedData = AppointmentSchema.omit({
    id: true,
    status: true,
  }).parse(appointmentData);

  const newAppointment = {
    ...validatedData,
    status: 'confirmado',
  };

  const docRef = await addDoc(
    collection(db, 'barbershops', BARBERSHOP_ID, 'appointments'),
    newAppointment
  );
  return docRef.id;
}

export { db };
