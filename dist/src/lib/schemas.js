// src/lib/schemas.ts
import { z } from 'zod';
// Schema para a coleção 'services'
export const ServiceSchema = z.object({
    id: z.string().optional(), // O ID virá do Firestore
    barbershopId: z.string(),
    name: z.string(),
    duration: z.number().positive(), // em minutos
    price: z.number().positive(),
    isActive: z.boolean().default(true),
});
// Schema para a coleção 'barbers'
export const BarberSchema = z.object({
    id: z.string().optional(),
    barbershopId: z.string(),
    name: z.string(),
    avatarUrl: z.string().url().optional(),
    isActive: z.boolean().default(true),
    // A disponibilidade pode ser mais complexa, mas vamos começar simples
    availability: z
        .record(z.string(), z.object({ start: z.string(), end: z.string() }))
        .optional(),
});
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
