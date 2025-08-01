"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Download, Save, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";

interface ForecastProduct {
  sku: string;
  name: string;
  accuracy: number;
  bias: "over" | "under" | null;
  currentForecast: number;
  manualOverride?: number;
  historicalData: { month: string; sales: number }[];
  forecastData: { month: string; forecast: number }[];
}

const forecastData: ForecastProduct[] = [
  {
    sku: "SKU-001",
    name: "Widget A",
    accuracy: 12,
    bias: "over",
    currentForecast: 1500,
    historicalData: [
      { month: "Jan", sales: 1200 },
      { month: "Feb", sales: 1350 },
      { month: "Mar", sales: 1420 },
      { month: "Apr", sales: 1380 },
      { month: "May", sales: 1450 },
      { month: "Jun", sales: 1520 },
    ],
    forecastData: [
      { month: "Jul", forecast: 1500 },
      { month: "Aug", forecast: 1500 },
      { month: "Sep", forecast: 1500 },
    ],
  },
  {
    sku: "SKU-002",
    name: "Widget B",
    accuracy: 25,
    bias: "under",
    currentForecast: 2200,
    historicalData: [
      { month: "Jan", sales: 1800 },
      { month: "Feb", sales: 1950 },
      { month: "Mar", sales: 2100 },
      { month: "Apr", sales: 2050 },
      { month: "May", sales: 2150 },
      { month: "Jun", sales: 2200 },
    ],
    forecastData: [
      { month: "Jul", forecast: 2200 },
      { month: "Aug", forecast: 2200 },
      { month: "Sep", forecast: 2200 },
    ],
  },
  {
    sku: "SKU-003",
    name: "Gadget Pro",
    accuracy: 8,
    bias: null,
    currentForecast: 800,
    historicalData: [
      { month: "Jan", sales: 750 },
      { month: "Feb", sales: 780 },
      { month: "Mar", sales: 820 },
      { month: "Apr", sales: 790 },
      { month: "May", sales: 810 },
      { month: "Jun", sales: 800 },
    ],
    forecastData: [
      { month: "Jul", forecast: 800 },
      { month: "Aug", forecast: 800 },
      { month: "Sep", forecast: 800 },
    ],
  },
  {
    sku: "SKU-004",
    name: "Gizmo Plus",
    accuracy: 35,
    bias: "over",
    currentForecast: 3100,
    historicalData: [
      { month: "Jan", sales: 2800 },
      { month: "Feb", sales: 2950 },
      { month: "Mar", sales: 3100 },
      { month: "Apr", sales: 3050 },
      { month: "May", sales: 3150 },
      { month: "Jun", sales: 3100 },
    ],
    forecastData: [
      { month: "Jul", forecast: 3100 },
      { month: "Aug", forecast: 3100 },
      { month: "Sep", forecast: 3100 },
    ],
  },
];

type SortField = keyof ForecastProduct;
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

function SortableHeader({ 
  field, 
  currentSort, 
  onSort, 
  children 
}: { 
  field: SortField; 
  currentSort: SortConfig | null; 
  onSort: (field: SortField) => void; 
  children: React.ReactNode;
}) {
  const isActive = currentSort?.field === field;
  
  return (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      <div className="ml-2 flex items-center">
        {isActive ? (
          currentSort.direction === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </Button>
  );
}

function ForecastChart({ product }: { product: ForecastProduct }) {
  const chartData = [
    ...product.historicalData.map(item => ({
      month: item.month,
      sales: item.sales,
      forecast: null,
    })),
    ...product.forecastData.map(item => ({
      month: item.month,
      sales: null,
      forecast: item.forecast,
    })),
  ];

  return (
    <div className="mt-4 p-4 bg-muted/20 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Demand Forecast: {product.name}</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stackId="1"
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.6}
            name="Historical Sales"
          />
          <Area 
            type="monotone" 
            dataKey="forecast" 
            stackId="1"
            stroke="#22c55e" 
            fill="#22c55e" 
            fillOpacity={0.6}
            name="Future Forecast"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Forecasting() {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [manualOverrides, setManualOverrides] = useState<Record<string, number>>({});

  const handleSort = (field: SortField) => {
    setSortConfig((current) => {
      if (current?.field === field) {
        return {
          field,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return forecastData;

    return [...forecastData].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      return 0;
    });
  }, [sortConfig]);

  const toggleRow = (sku: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(sku)) {
      newExpanded.delete(sku);
    } else {
      newExpanded.add(sku);
    }
    setExpandedRows(newExpanded);
  };

  const handleManualOverride = (sku: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      const newOverrides = { ...manualOverrides };
      delete newOverrides[sku];
      setManualOverrides(newOverrides);
    } else {
      setManualOverrides(prev => ({ ...prev, [sku]: numValue }));
    }
  };

  const exportToCSV = () => {
    const headers = ["SKU", "Product Name", "Accuracy (MAPE)", "Bias", "Current Forecast (Units)", "Manual Override"];
    const csvData = sortedData.map(product => [
      product.sku,
      product.name,
      `${product.accuracy}%`,
      product.bias || "",
      product.currentForecast,
      manualOverrides[product.sku] || ""
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_forecasts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 15) return "success";
    if (accuracy <= 25) return "warning";
    return "critical";
  };

  const getBiasIcon = (bias: "over" | "under" | null) => {
    if (bias === "over") return <ArrowUp className="h-4 w-4 text-destructive" />;
    if (bias === "under") return <ArrowDown className="h-4 w-4 text-success" />;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline">Forecasting</CardTitle>
            <CardDescription>Generate and manage demand forecasts.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Product Forecasts</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>
                    <SortableHeader
                      field="sku"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      SKU
                    </SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      field="name"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Product Name
                    </SortableHeader>
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      field="accuracy"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Accuracy (MAPE)
                    </SortableHeader>
                  </TableHead>
                  <TableHead>Bias</TableHead>
                  <TableHead>
                    <SortableHeader
                      field="currentForecast"
                      currentSort={sortConfig}
                      onSort={handleSort}
                    >
                      Current Forecast (Units)
                    </SortableHeader>
                  </TableHead>
                  <TableHead>Manual Override</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((product) => (
                  <React.Fragment key={product.sku}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(product.sku)}
                        >
                          {expandedRows.has(product.sku) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Badge variant={getAccuracyColor(product.accuracy) as any}>
                          {product.accuracy}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getBiasIcon(product.bias)}
                      </TableCell>
                      <TableCell>{product.currentForecast.toLocaleString()}</TableCell>
                      <TableCell>
                        <Input
                          placeholder="e.g. 1600"
                          value={manualOverrides[product.sku] || ""}
                          onChange={(e) => handleManualOverride(product.sku, e.target.value)}
                          className="w-32"
                        />
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(product.sku) && (
                      <TableRow>
                        <TableCell colSpan={7} className="p-0">
                          <ForecastChart product={product} />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 