import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const inventoryData = [
  {
    id: "SKU-001",
    name: "Quantum Stabilizer",
    status: "In Stock",
    level: 250,
    reorderPoint: 100,
    leadTime: "14 days",
  },
  {
    id: "SKU-002",
    name: "Hyper-Drive Coolant",
    status: "Low Stock",
    level: 45,
    reorderPoint: 50,
    leadTime: "7 days",
  },
  {
    id: "SKU-003",
    name: "Plasma Injector",
    status: "In Stock",
    level: 600,
    reorderPoint: 200,
    leadTime: "21 days",
  },
  {
    id: "SKU-004",
    name: "Gravity Plating",
    status: "Out of Stock",
    level: 0,
    reorderPoint: 75,
    leadTime: "10 days",
  },
  {
    id: "SKU-005",
    name: "Neutrino Sensor",
    status: "In Stock",
    level: 120,
    reorderPoint: 80,
    leadTime: "12 days",
  },
]

type InventoryTableProps = {
    className?: string;
};

export function InventoryTable({ className }: InventoryTableProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="font-headline">Inventory Management</CardTitle>
        <CardDescription>
          Product-level inventory status, reorder points, and lead times.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Current Level</TableHead>
              <TableHead className="text-right">Reorder Point</TableHead>
              <TableHead>Lead Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.id}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "In Stock"
                        ? "secondary"
                        : item.status === "Low Stock"
                        ? "default"
                        : "destructive"
                    }
                     className={cn({
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200": item.status === "In Stock",
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200": item.status === "Low Stock",
                     })}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{item.level}</TableCell>
                <TableCell className="text-right">{item.reorderPoint}</TableCell>
                <TableCell>{item.leadTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
