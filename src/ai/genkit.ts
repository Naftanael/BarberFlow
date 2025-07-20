// src/ai/genkit.ts
import { genkit, flow } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { getActiveServices } from '../lib/firestore'; // Importa a função de acesso ao DB
import { ServiceSchema } from '../lib/schemas'; // Importa o schema para validação

// Inicializa o Genkit com o plugin do Google AI
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-pro',
});

// --- Fluxos da Barbearia (Nossa API) ---

export const getServicesFlow = flow(
  {
    name: 'getServicesFlow',
    inputSchema: z.object({ barbershopId: z.string() }),
    outputSchema: z.array(ServiceSchema),
  },
  async ({ barbershopId }) => {
    try {
      const services = await getActiveServices(barbershopId);
      return services;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      // Em um app real, teríamos um tratamento de erro mais robusto
      throw new Error('Não foi possível carregar os serviços.');
    }
  }
);
