"use client";

import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface InventoryItem {
  id: string;
  name: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  level: number;
  reorderPoint: number;
  leadTime: string;
}

const inventoryData: InventoryItem[] = [
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

type SortField = keyof InventoryItem;
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

type InventoryTableProps = {
    className?: string;
};

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

export function InventoryTable({ className }: InventoryTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (field: SortField) => {
    setSortConfig((current) => {
      if (current?.field === field) {
        // If clicking the same field, toggle direction
        return {
          field,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      // If clicking a new field, set it as ascending
      return { field, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return inventoryData;

    return [...inventoryData].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      // For status, create a priority order
      if (sortConfig.field === "status") {
        const statusPriority = { "In Stock": 1, "Low Stock": 2, "Out of Stock": 3 };
        const aPriority = statusPriority[a.status as keyof typeof statusPriority];
        const bPriority = statusPriority[b.status as keyof typeof statusPriority];
        const comparison = aPriority - bPriority;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      return 0;
    });
  }, [sortConfig]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="font-headline">Inventory Management</CardTitle>
        <CardDescription>
          Product-level inventory status, reorder points, and lead times. Click column headers to sort.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader
                  field="name"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Product
                </SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader
                  field="status"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Status
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader
                  field="level"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Current Level
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader
                  field="reorderPoint"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Reorder Point
                </SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader
                  field="leadTime"
                  currentSort={sortConfig}
                  onSort={handleSort}
                >
                  Lead Time
                </SortableHeader>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.id}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "In Stock"
                        ? "success"
                        : item.status === "Low Stock"
                        ? "warning"
                        : "critical"
                    }
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
