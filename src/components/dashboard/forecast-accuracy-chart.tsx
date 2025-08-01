"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const chartData = [
  { month: "Jan 23", accuracy: 82.5 },
  { month: "Feb 23", accuracy: 85.1 },
  { month: "Mar 23", accuracy: 84.3 },
  { month: "Apr 23", accuracy: 87.6 },
  { month: "May 23", accuracy: 88.2 },
  { month: "Jun 23", accuracy: 86.4 },
  { month: "Jul 23", accuracy: 89.1 },
  { month: "Aug 23", accuracy: 90.3 },
  { month: "Sep 23", accuracy: 88.9 },
  { month: "Oct 23", accuracy: 91.0 },
  { month: "Nov 23", accuracy: 92.4 },
  { month: "Dec 23", accuracy: 90.5 },
]

const chartConfig = {
  accuracy: {
    label: "Accuracy",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type ForecastAccuracyChartProps = {
  className?: string;
};

export function ForecastAccuracyChart({ className }: ForecastAccuracyChartProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="font-headline">Forecast Accuracy Tracking</CardTitle>
        <CardDescription>Historical accuracy metrics and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              domain={[75, 100]}
              tickFormatter={(tick) => `${tick}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="var(--color-accuracy)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-accuracy)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                  indicator="line"
                />
              }
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
