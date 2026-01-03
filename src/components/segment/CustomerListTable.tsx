import { useState } from "react";
import { Download, FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CustomerListTableProps {
  filters: {
    activityDays: string;
    valueTier: string;
  };
  onExport: () => void;
}

// Mock customer data with masked MSISDNs
const mockCustomers = [
  { msisdn: "2547****123", regDate: "2023-06-15", lastActivity: "2024-01-14", txnCount: 45, txnValue: 78500, valueTier: "High", status: "Active", churnRisk: "Low" },
  { msisdn: "2547****456", regDate: "2023-08-22", lastActivity: "2024-01-15", txnCount: 32, txnValue: 52000, valueTier: "High", status: "Active", churnRisk: "Low" },
  { msisdn: "2547****789", regDate: "2023-03-10", lastActivity: "2024-01-10", txnCount: 18, txnValue: 25000, valueTier: "Medium", status: "Active", churnRisk: "Medium" },
  { msisdn: "2547****012", regDate: "2023-11-05", lastActivity: "2024-01-08", txnCount: 12, txnValue: 15500, valueTier: "Medium", status: "Active", churnRisk: "Medium" },
  { msisdn: "2547****345", regDate: "2022-09-18", lastActivity: "2024-01-12", txnCount: 8, txnValue: 8200, valueTier: "Low", status: "Active", churnRisk: "High" },
  { msisdn: "2547****678", regDate: "2023-01-25", lastActivity: "2023-12-20", txnCount: 5, txnValue: 4500, valueTier: "Low", status: "Dormant", churnRisk: "High" },
  { msisdn: "2547****901", regDate: "2023-07-14", lastActivity: "2024-01-15", txnCount: 52, txnValue: 92000, valueTier: "High", status: "Active", churnRisk: "Low" },
  { msisdn: "2547****234", regDate: "2023-04-30", lastActivity: "2024-01-13", txnCount: 28, txnValue: 38000, valueTier: "Medium", status: "Active", churnRisk: "Low" },
  { msisdn: "2547****567", regDate: "2023-10-08", lastActivity: "2024-01-11", txnCount: 15, txnValue: 19000, valueTier: "Medium", status: "Active", churnRisk: "Medium" },
  { msisdn: "2547****890", regDate: "2023-02-14", lastActivity: "2024-01-09", txnCount: 6, txnValue: 5800, valueTier: "Low", status: "Active", churnRisk: "High" },
];

const getValueTierColor = (tier: string) => {
  switch (tier) {
    case "High":
      return "bg-success/10 text-success border-success/20";
    case "Medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "Low":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getChurnRiskColor = (risk: string) => {
  switch (risk) {
    case "Low":
      return "bg-success/10 text-success border-success/20";
    case "Medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "High":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Dormant":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function CustomerListTable({ filters, onExport }: CustomerListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter customers based on selected filters
  const filteredCustomers = mockCustomers.filter((customer) => {
    if (filters.valueTier !== "all" && customer.valueTier.toLowerCase() !== filters.valueTier) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">
          Customer Preview
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({filteredCustomers.length.toLocaleString()} customers)
          </span>
        </CardTitle>
        <Button variant="outline" className="gap-2" onClick={onExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">MSISDN</TableHead>
                <TableHead className="font-semibold">Reg. Date</TableHead>
                <TableHead className="font-semibold">Last Activity</TableHead>
                <TableHead className="font-semibold text-right">TXN Count (30D)</TableHead>
                <TableHead className="font-semibold text-right">TXN Value (30D)</TableHead>
                <TableHead className="font-semibold">Value Tier</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Churn Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-medium">{customer.msisdn}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.regDate}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.lastActivity}</TableCell>
                  <TableCell className="text-right font-medium">{customer.txnCount}</TableCell>
                  <TableCell className="text-right font-medium">
                    KES {customer.txnValue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium", getValueTierColor(customer.valueTier))}>
                      {customer.valueTier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium", getStatusColor(customer.status))}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("font-medium", getChurnRiskColor(customer.churnRisk))}>
                      {customer.churnRisk}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
