"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartData = [
  { driver: "Seasonality", value: 45, fill: "var(--color-seasonality)" },
  { driver: "Promotions", value: 25, fill: "var(--color-promotions)" },
  { driver: "Market Trends", value: 20, fill: "var(--color-trends)" },
  { driver: "Economic Factors", value: 10, fill: "var(--color-economic)" },
]

const chartConfig = {
  value: {
    label: "Value",
  },
  seasonality: {
    label: "Seasonality",
    color: "hsl(var(--chart-1))",
  },
  promotions: {
    label: "Promotions",
    color: "hsl(var(--chart-2))",
  },
  trends: {
    label: "Market Trends",
    color: "hsl(var(--chart-3))",
  },
  economic: {
    label: "Economic Factors",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

type DemandDriversChartProps = {
  className?: string;
};

export function DemandDriversChart({ className }: DemandDriversChartProps) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader>
        <CardTitle className="font-headline">Demand Drivers Analysis</CardTitle>
        <CardDescription>Breakdown of factors influencing demand</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="driver"
              innerRadius={60}
              strokeWidth={5}
            />
             <ChartLegend
              content={<ChartLegendContent nameKey="driver" />}
              className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
