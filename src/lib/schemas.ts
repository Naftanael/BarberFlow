// src/lib/schemas.ts
import { z } from 'zod';

// Schema para a coleção 'services'
export const ServiceSchema = z.object({
  id: z.string().optional(), // O ID virá do Firestore
  name: z.string(),
  duration: z.number().positive(), // em minutos
  price: z.number().positive(),
  isActive: z.boolean().default(true),
});
export type Service = z.infer<typeof ServiceSchema>;

// Schema para a disponibilidade do barbeiro
export const AvailabilitySchema = z.object({
  workDays: z.array(z.string()),
  workHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
  breaks: z.array(
    z.object({
      start: z.string(),
      end: z.string(),
    })
  ),
});
export type AvailabilityData = z.infer<typeof AvailabilitySchema>;

// Schema para a coleção 'barbers'
export const BarberSchema = z.object({
  id: z.string().optional(),
  barbershopId: z.string(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  availability: AvailabilitySchema.optional(),
});
export type Barber = z.infer<typeof BarberSchema>;

// Schema para a coleção 'clients'
export const ClientSchema = z.object({
  id: z.string().optional(),
  barbershopId: z.string(),
  name: z.string(),
  phone: z.string(),
  lastAppointment: z.string(), // Mantendo como string para simplicidade
});
export type Client = z.infer<typeof ClientSchema>;

// Schema para a coleção 'appointments'
export const AppointmentSchema = z.object({
  id: z.string().optional(),
  barbershopId: z.string(),
  serviceId: z.string(),
  barberId: z.string(),
  clientName: z.string(),
  clientPhone: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  status: z.enum(['confirmado', 'concluído', 'cancelado']),
});
export type Appointment = z.infer<typeof AppointmentSchema>;
