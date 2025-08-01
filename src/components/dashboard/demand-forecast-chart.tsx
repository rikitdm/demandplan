"use client"

import { BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartData = [
  { month: "January", actual: 186, forecasted: 80, predicted: 150 },
  { month: "February", actual: 305, forecasted: 200, predicted: 250 },
  { month: "March", actual: 237, forecasted: 120, predicted: 200 },
  { month: "April", actual: 273, forecasted: 190, predicted: 250 },
  { month: "May", actual: 209, forecasted: 130, predicted: 180 },
  { month: "June", actual: 259, forecasted: 160, predicted: 220 },
]

const chartConfig = {
  actual: {
    label: "Actual Demand",
    color: "hsl(var(--chart-1))",
  },
  forecasted: {
    label: "Forecasted Demand",
    color: "hsl(var(--chart-2))",
  },
  predicted: {
    label: "Predicted Demand",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

type DemandForecastChartProps = {
  className?: string;
};

export function DemandForecastChart({ className }: DemandForecastChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="font-headline">Demand Forecasting</CardTitle>
        <CardDescription>Actual vs. Forecasted vs. Predicted Demand</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}k`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="actual"
              type="monotone"
              stroke="var(--color-actual)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="forecasted"
              type="monotone"
              stroke="var(--color-forecasted)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="predicted"
              type="monotone"
              stroke="var(--color-predicted)"
              strokeWidth={2}
              strokeDasharray="3 4"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
