"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WandSparkles } from "lucide-react";
import {
  generateStockAlerts,
  GenerateStockAlertsInput,
  GenerateStockAlertsOutput,
} from "@/ai/flows/generate-stock-alerts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  historicalDemandData: z.string().min(10, {
    message: "Please provide more detailed historical demand data.",
  }),
  seasonalityData: z.string().min(10, {
    message: "Please provide more detailed seasonality data.",
  }),
  leadTimes: z.string().min(5, {
    message: "Please provide lead times.",
  }),
  currentInventoryLevels: z.string().min(10, {
    message: "Please provide more detailed current inventory levels.",
  }),
}) as z.ZodType<GenerateStockAlertsInput>;

export function AiAlerts() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateStockAlertsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalDemandData: "Last 6 months sales: Product A (1200 units), Product B (850 units), Product C (1500 units). Spike in Product A during summer.",
      seasonalityData: "Summer peak for Product A. Holiday season peak for Product C. Product B has stable demand year-round.",
      leadTimes: "Product A: 14 days. Product B: 7 days. Product C: 21 days.",
      currentInventoryLevels: "Product A: 150 units. Product B: 80 units. Product C: 200 units.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const aiResult = await generateStockAlerts(values);
      setResult(aiResult);
    } catch (error) {
      console.error("Error generating alerts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate alerts. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <WandSparkles className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">Automated Alerts & Reorder Suggestions</CardTitle>
        </div>
        <CardDescription>
          Leverage AI to generate proactive stock alerts and reorder suggestions based on your data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="historicalDemandData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Demand Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Last quarter sales..." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seasonalityData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seasonality Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Holiday sales trends..." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadTimes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Times</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Supplier A: 14 days..." {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentInventoryLevels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Inventory Levels</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Product A: 500 units..." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate Alerts"}
              </Button>
            </form>
          </Form>

          <div className="space-y-4">
            {loading && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Reorder Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                    <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted" />
                  </CardContent>
                </Card>
              </>
            )}
            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Alerts</CardTitle>
                    <CardDescription>Products at risk of stockout.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{result.stockAlerts}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Reorder Suggestions</CardTitle>
                    <CardDescription>Recommended quantities to reorder.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{result.reorderSuggestions}</p>
                  </CardContent>
                </Card>
              </>
            )}
            {!loading && !result && (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">
                  AI-generated alerts and suggestions will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
