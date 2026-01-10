import { useState } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
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
import type { CustomerPreview } from "@/services/segmentApi";

interface CustomerListTableProps {
  filters: {
    activityDays: string;
    valueTier: string;
  };
  onExport: () => void;
  customers?: CustomerPreview[];
}

const getValueTierColor = (tier: string) => {
  switch (tier?.toLowerCase()) {
    case "high":
      return "bg-success/10 text-success border-success/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "low":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getChurnRiskColor = (risk: string) => {
  switch (risk?.toLowerCase()) {
    case "low":
      return "bg-success/10 text-success border-success/20";
    case "medium":
      return "bg-warning/10 text-warning border-warning/20";
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function CustomerListTable({ filters, onExport, customers = [] }: CustomerListTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter customers based on selected filters
  const filteredCustomers = customers.filter((customer) => {
    if (filters.valueTier !== "all" && customer.value_tier?.toLowerCase() !== filters.valueTier) {
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
                <TableHead className="font-semibold">Churn Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No customers to display
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono font-medium">{customer.msisdn}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.reg_date}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.last_activity}</TableCell>
                    <TableCell className="text-right font-medium">{customer.txn_count_30d}</TableCell>
                    <TableCell className="text-right font-medium">
                      {customer.txn_value_30d}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium", getValueTierColor(customer.value_tier))}>
                        {customer.value_tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium", getChurnRiskColor(customer.churn_risk))}>
                        {customer.churn_risk}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
}
