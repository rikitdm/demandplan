import { AiAlerts } from "@/components/dashboard/ai-alerts";
import { DemandDriversChart } from "@/components/dashboard/demand-drivers-chart";
import { DemandForecastChart } from "@/components/dashboard/demand-forecast-chart";
import { ForecastAccuracyChart } from "@/components/dashboard/forecast-accuracy-chart";
import { Header } from "@/components/dashboard/header";
import { InventoryTable } from "@/components/dashboard/inventory-table";
import { KpiCards } from "@/components/dashboard/kpi-cards";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <KpiCards />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 lg:gap-8">
          <DemandForecastChart className="lg:col-span-4" />
          <DemandDriversChart className="lg:col-span-3" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 lg:gap-8">
          <InventoryTable className="lg:col-span-4" />
          <ForecastAccuracyChart className="lg:col-span-3" />
        </div>
        <AiAlerts />
      </main>
    </div>
  );
}
