// This file provides mock AI functionality for stock alerts generation
// In production, this would use a real AI service

'use server';

/**
 * @fileOverview An AI agent that provides automated reorder suggestions and stock alerts.
 *
 * - generateStockAlerts - A function that generates reorder suggestions and stock alerts.
 * - GenerateStockAlertsInput - The input type for the generateStockAlerts function.
 * - GenerateStockAlertsOutput - The return type for the generateStockAlerts function.
 */

import {z} from 'zod';

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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock AI analysis based on input data
  const { historicalDemandData, seasonalityData, leadTimes, currentInventoryLevels } = input;
  
  // Generate realistic stock alerts and reorder suggestions
  const stockAlerts = generateStockAlertsFromData(historicalDemandData, currentInventoryLevels);
  const reorderSuggestions = generateReorderSuggestions(historicalDemandData, seasonalityData, leadTimes, currentInventoryLevels);
  
  return {
    stockAlerts,
    reorderSuggestions,
  };
}

function generateStockAlertsFromData(historicalData: string, currentLevels: string): string {
  const alerts = [];
  
  if (historicalData.includes("Product A") && currentLevels.includes("150 units")) {
    alerts.push("🚨 CRITICAL: Product A stock level (150 units) is below recommended safety stock. Risk of stockout within 2 weeks.");
  }
  
  if (historicalData.includes("Product B") && currentLevels.includes("80 units")) {
    alerts.push("⚠️ WARNING: Product B inventory (80 units) approaching reorder point. Consider placing order within 1 week.");
  }
  
  if (historicalData.includes("Product C") && currentLevels.includes("200 units")) {
    alerts.push("✅ GOOD: Product C inventory levels are healthy. Monitor for seasonal demand changes.");
  }
  
  return alerts.join("\n\n");
}

function generateReorderSuggestions(historicalData: string, seasonalityData: string, leadTimes: string, currentLevels: string): string {
  const suggestions = [];
  
  // Product A Analysis
  if (historicalData.includes("Product A") && seasonalityData.includes("summer")) {
    suggestions.push("📦 Product A: Recommend ordering 800 units (considering summer peak demand). Lead time: 14 days. Order now to meet seasonal demand.");
  }
  
  // Product B Analysis
  if (historicalData.includes("Product B") && currentLevels.includes("80 units")) {
    suggestions.push("📦 Product B: Suggest ordering 400 units to replenish stock. Lead time: 7 days. Current levels are below optimal.");
  }
  
  // Product C Analysis
  if (historicalData.includes("Product C") && seasonalityData.includes("holiday")) {
    suggestions.push("📦 Product C: Recommend ordering 1200 units for holiday season preparation. Lead time: 21 days. Plan ahead for seasonal spike.");
  }
  
  // General recommendations
  suggestions.push("\n📊 General Recommendations:");
  suggestions.push("• Monitor demand patterns weekly");
  suggestions.push("• Adjust safety stock levels based on seasonality");
  suggestions.push("• Consider supplier lead time variations");
  suggestions.push("• Implement automated reorder triggers");
  
  return suggestions.join("\n");
}
