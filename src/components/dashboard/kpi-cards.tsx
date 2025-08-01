"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, Truck, Target, RotateCcw, Box, Clock, DollarSign, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, HelpCircle, Download } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  className?: string;
  valueClassName?: string;
  tooltipContent: string;
  timeSeriesData: { month: string; value: number }[];
  metricType: "percentage" | "number" | "currency";
  accuracy?: string;
  accuracyColor?: "success" | "warning" | "critical";
}

function KpiCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className, 
  valueClassName,
  tooltipContent,
  timeSeriesData,
  metricType,
  accuracy,
  accuracyColor
}: KpiCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatValue = (val: number) => {
    switch (metricType) {
      case "percentage":
        return `${val.toFixed(1)}%`;
      case "currency":
        return `$${val.toFixed(2)}`;
      default:
        return val.toFixed(1);
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltipContent}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
        
        {accuracy && (
          <div className="mt-2">
            <Badge 
              variant={accuracyColor === "success" ? "success" : accuracyColor === "warning" ? "warning" : "critical"}
              className="text-xs"
            >
              {accuracy}
            </Badge>
          </div>
        )}

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-2 h-6 px-2 text-xs">
              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {isOpen ? "Hide" : "Show"} trend
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Monthly Trend</span>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-end justify-between gap-1">
                {timeSeriesData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div 
                      className="w-4 bg-primary rounded-sm"
                      style={{ 
                        height: `${(data.value / Math.max(...timeSeriesData.map(d => d.value))) * 40}px` 
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {formatValue(Math.min(...timeSeriesData.map(d => d.value)))}</span>
                <span>Max: {formatValue(Math.max(...timeSeriesData.map(d => d.value)))}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

const kpiData = [
  {
    title: "Forecast Accuracy (MAPE)",
    value: "14.8%",
    change: "-2.1% from last month",
    icon: Target,
    valueClassName: "text-accent",
    tooltipContent: "Measures how close the forecast is to actual sales. Lower values indicate better accuracy.",
    timeSeriesData: [
      { month: "Feb", value: 18.2 },
      { month: "Mar", value: 16.5 },
      { month: "Apr", value: 15.3 },
      { month: "May", value: 14.9 },
      { month: "Jun", value: 14.8 }
    ],
    metricType: "percentage" as const,
    accuracy: "Good",
    accuracyColor: "success" as const
  },
  {
    title: "Inventory Turnover",
    value: "5.2",
    change: "+0.4 from last month",
    icon: RotateCcw,
    tooltipContent: "Number of times inventory is sold and replaced in a given period. Higher values indicate efficient inventory management.",
    timeSeriesData: [
      { month: "Feb", value: 4.1 },
      { month: "Mar", value: 4.3 },
      { month: "Apr", value: 4.7 },
      { month: "May", value: 4.9 },
      { month: "Jun", value: 5.2 }
    ],
    metricType: "number" as const
  },
  {
    title: "Stockout Rate",
    value: "1.9%",
    change: "-0.2% from last month",
    icon: AlertTriangle,
    tooltipContent: "Percentage of time when demand cannot be met due to insufficient inventory. Lower values are better.",
    timeSeriesData: [
      { month: "Feb", value: 2.8 },
      { month: "Mar", value: 2.5 },
      { month: "Apr", value: 2.2 },
      { month: "May", value: 2.0 },
      { month: "Jun", value: 1.9 }
    ],
    metricType: "percentage" as const,
    accuracy: "Excellent",
    accuracyColor: "success" as const
  },
  {
    title: "Fill Rate",
    value: "98.1%",
    change: "+0.2% from last month",
    icon: Box,
    tooltipContent: "Percentage of customer orders that can be fulfilled immediately from available inventory.",
    timeSeriesData: [
      { month: "Feb", value: 96.5 },
      { month: "Mar", value: 97.1 },
      { month: "Apr", value: 97.6 },
      { month: "May", value: 97.9 },
      { month: "Jun", value: 98.1 }
    ],
    metricType: "percentage" as const
  },
  {
    title: "On-Time Delivery (OTD)",
    value: "96.5%",
    change: "-1.2% from last month",
    icon: Clock,
    tooltipContent: "Percentage of orders delivered on or before the promised delivery date.",
    timeSeriesData: [
      { month: "Feb", value: 98.2 },
      { month: "Mar", value: 97.8 },
      { month: "Apr", value: 97.1 },
      { month: "May", value: 96.8 },
      { month: "Jun", value: 96.5 }
    ],
    metricType: "percentage" as const,
    accuracy: "Warning",
    accuracyColor: "warning" as const
  },
  {
    title: "GMROI",
    value: "3.2",
    change: "+0.1 from last month",
    icon: DollarSign,
    tooltipContent: "Gross Margin Return on Investment. Measures the profit return on inventory investment.",
    timeSeriesData: [
      { month: "Feb", value: 2.8 },
      { month: "Mar", value: 2.9 },
      { month: "Apr", value: 3.0 },
      { month: "May", value: 3.1 },
      { month: "Jun", value: 3.2 }
    ],
    metricType: "number" as const
  },
];

export function KpiCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {kpiData.map((kpi) => (
        <KpiCard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          valueClassName={kpi.valueClassName}
          tooltipContent={kpi.tooltipContent}
          timeSeriesData={kpi.timeSeriesData}
          metricType={kpi.metricType}
          accuracy={kpi.accuracy}
          accuracyColor={kpi.accuracyColor}
        />
      ))}
    </div>
  );
}
