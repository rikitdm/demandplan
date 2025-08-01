// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview An AI agent that provides automated reorder suggestions and stock alerts.
 *
 * - generateStockAlerts - A function that generates reorder suggestions and stock alerts.
 * - GenerateStockAlertsInput - The input type for the generateStockAlerts function.
 * - GenerateStockAlertsOutput - The return type for the generateStockAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStockAlertsInputSchema = z.object({
  historicalDemandData: z
    .string()
    .describe('Historical demand data, including sales transactions.'),
  seasonalityData: z.string().describe('Seasonality data for demand patterns.'),
  leadTimes: z.string().describe('Lead times for product replenishment.'),
  currentInventoryLevels: z
    .string()
    .describe('Current inventory levels for each product.'),
});
export type GenerateStockAlertsInput = z.infer<
  typeof GenerateStockAlertsInputSchema
>;

const GenerateStockAlertsOutputSchema = z.object({
  reorderSuggestions: z
    .string()
    .describe('Reorder suggestions for each product.'),
  stockAlerts: z.string().describe('Stock alerts for products at risk.'),
});
export type GenerateStockAlertsOutput = z.infer<
  typeof GenerateStockAlertsOutputSchema
>;

export async function generateStockAlerts(
  input: GenerateStockAlertsInput
): Promise<GenerateStockAlertsOutput> {
  return generateStockAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStockAlertsPrompt',
  input: {schema: GenerateStockAlertsInputSchema},
  output: {schema: GenerateStockAlertsOutputSchema},
  prompt: `You are an expert supply chain manager. Based on the provided data, you will generate reorder suggestions and stock alerts. 

Consider historical demand, seasonality, lead times, and current inventory levels to provide proactive inventory management recommendations.

Historical Demand Data: {{{historicalDemandData}}}
Seasonality Data: {{{seasonalityData}}}
Lead Times: {{{leadTimes}}}
Current Inventory Levels: {{{currentInventoryLevels}}}

Provide clear and actionable reorder suggestions and stock alerts.
`,
});

const generateStockAlertsFlow = ai.defineFlow(
  {
    name: 'generateStockAlertsFlow',
    inputSchema: GenerateStockAlertsInputSchema,
    outputSchema: GenerateStockAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
