import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const segments = [
  {
    id: 1,
    name: "High Value Active Users",
    type: "Value",
    customerCount: 125000,
    lastRefresh: "2024-01-15 14:30",
    status: "Active",
  },
  {
    id: 2,
    name: "Dormant 30 Days",
    type: "Dormant",
    customerCount: 89500,
    lastRefresh: "2024-01-15 14:30",
    status: "Active",
  },
  {
    id: 3,
    name: "New Users Dec 2023",
    type: "New",
    customerCount: 45200,
    lastRefresh: "2024-01-14 09:00",
    status: "Active",
  },
  {
    id: 4,
    name: "Churn Risk High",
    type: "Active",
    customerCount: 24500,
    lastRefresh: "2024-01-15 12:00",
    status: "Active",
  },
  {
    id: 5,
    name: "Win-back Target Q1",
    type: "Dormant",
    customerCount: 156000,
    lastRefresh: "2024-01-10 08:00",
    status: "Draft",
  },
  {
    id: 6,
    name: "Addis Ababa Urban Youth",
    type: "Custom",
    customerCount: 78300,
    lastRefresh: "2024-01-15 10:00",
    status: "Active",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Dormant":
      return "bg-warning/10 text-warning border-warning/20";
    case "Value":
      return "bg-info/10 text-info border-info/20";
    case "New":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Custom":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/20";
    case "Draft":
      return "bg-muted text-muted-foreground border-muted";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Segmentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredSegments = segments.filter((segment) =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Segmentation</h1>
          <p className="text-muted-foreground">View and manage customer segments</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/segmentation/create")}>
          <Plus className="w-4 h-4" />
          Create Segment
        </Button>
      </div>

      {/* Search Bar Only */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search segments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-card border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Segment Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold text-right">Customer Count</TableHead>
              <TableHead className="font-semibold">Last Refresh</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSegments.map((segment) => (
              <TableRow key={segment.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent">
                      <Users className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <p className="font-medium">{segment.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getTypeColor(segment.type))}>
                    {segment.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {segment.customerCount.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {segment.lastRefresh}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getStatusColor(segment.status))}>
                    {segment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => navigate(`/segmentation/${segment.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
