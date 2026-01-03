import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Plug, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const services = [
  { id: "mpesa-core", name: "M-Pesa Core API", status: "Active", version: "v2.3.1", createdBy: "System Admin", lastUpdated: "2024-01-15 10:30" },
  { id: "smsc", name: "SMSC", status: "Active", version: "v1.8.0", createdBy: "System Admin", lastUpdated: "2024-01-14 14:20" },
  { id: "ussd-gateway", name: "USSD Gateway", status: "Active", version: "v3.1.2", createdBy: "System Admin", lastUpdated: "2024-01-13 09:15" },
  { id: "app-push", name: "App Push", status: "Active", version: "v2.0.0", createdBy: "John K.", lastUpdated: "2024-01-12 16:45" },
  { id: "reward-account", name: "Reward Account", status: "Active", version: "v1.5.3", createdBy: "System Admin", lastUpdated: "2024-01-11 11:00" },
  { id: "email-service", name: "Email Service", status: "Inactive", version: "v1.2.0", createdBy: "Mary W.", lastUpdated: "2024-01-10 08:30" },
  { id: "ivr-config", name: "IVR Config", status: "Active", version: "v1.0.1", createdBy: "System Admin", lastUpdated: "2024-01-09 15:20" },
  { id: "database", name: "Database", status: "Active", version: "v4.2.0", createdBy: "System Admin", lastUpdated: "2024-01-08 12:10" },
];

export default function Configuration() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10"><Plug className="w-6 h-6 text-primary" /></div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Connected Services</h1>
          <Tooltip>
            <TooltipTrigger><Info className="w-4 h-4 text-muted-foreground" /></TooltipTrigger>
            <TooltipContent>Manage system integrations and service configurations.</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Service Name</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Active Version</TableHead>
              <TableHead className="font-semibold">Created By</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="font-semibold w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={service.status === "Active" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell>{service.version}</TableCell>
                <TableCell className="text-muted-foreground">{service.createdBy}</TableCell>
                <TableCell className="text-muted-foreground">{service.lastUpdated}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/configuration/${service.id}`)} className="gap-1">
                    <Eye className="w-3 h-3" />View
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
