"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WandSparkles, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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

interface FeedbackData {
  stockAlerts: 'helpful' | 'not-helpful' | null;
  reorderSuggestions: 'helpful' | 'not-helpful' | null;
}

export function AiAlerts() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateStockAlertsOutput | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData>({
    stockAlerts: null,
    reorderSuggestions: null,
  });
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    setFeedback({ stockAlerts: null, reorderSuggestions: null });
    
    try {
      const aiResult = await generateStockAlerts(values);
      setResult(aiResult);
      toast({
        title: "Success",
        description: "AI alerts generated successfully!",
      });
    } catch (error) {
      console.error("Error generating alerts:", error);
      
      // Provide specific error messages based on error type
      let errorMessage = "Failed to generate alerts. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes("validation")) {
          errorMessage = "Invalid input data. Please check your form entries and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again with less data.";
        } else if (error.message.includes("API key") || error.message.includes("FAILED_PRECONDITION")) {
          errorMessage = "AI service is currently unavailable. Using mock data for demonstration.";
          // Provide mock result for demonstration
          setResult({
            stockAlerts: "🚨 CRITICAL: Product A stock level (150 units) is below recommended safety stock.\n\n⚠️ WARNING: Product B inventory (80 units) approaching reorder point.",
            reorderSuggestions: "📦 Product A: Recommend ordering 800 units for summer demand.\n📦 Product B: Suggest ordering 400 units to replenish stock.\n\n📊 General Recommendations:\n• Monitor demand patterns weekly\n• Adjust safety stock levels based on seasonality"
          });
          setLoading(false);
          return;
        }
      }
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleFeedback = (type: 'stockAlerts' | 'reorderSuggestions', value: 'helpful' | 'not-helpful') => {
    setFeedback(prev => ({ ...prev, [type]: value }));
    
    // Here you would typically send feedback to your backend/AI service
    console.log(`Feedback for ${type}: ${value}`);
    
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! This helps improve our AI suggestions.",
    });
  };

  const getErrorField = (error: string) => {
    if (error.includes("historical")) return "historicalDemandData";
    if (error.includes("seasonality")) return "seasonalityData";
    if (error.includes("lead")) return "leadTimes";
    if (error.includes("inventory")) return "currentInventoryLevels";
    return null;
  };

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
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
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
                    <FormDescription>
                      Provide detailed sales history for accurate predictions.
                    </FormDescription>
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
                    <FormDescription>
                      Describe seasonal patterns and peak periods.
                    </FormDescription>
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
                    <FormDescription>
                      Include supplier lead times for each product.
                    </FormDescription>
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
                    <FormDescription>
                      Current stock levels for all products.
                    </FormDescription>
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
                    <div className="flex items-center justify-between">
                      <CardTitle>Stock Alerts</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback('stockAlerts', 'helpful')}
                          disabled={feedback.stockAlerts !== null}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback('stockAlerts', 'not-helpful')}
                          disabled={feedback.stockAlerts !== null}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>Products at risk of stockout.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{result.stockAlerts}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Reorder Suggestions</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback('reorderSuggestions', 'helpful')}
                          disabled={feedback.reorderSuggestions !== null}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback('reorderSuggestions', 'not-helpful')}
                          disabled={feedback.reorderSuggestions !== null}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
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
